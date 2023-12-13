import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  createTRPCRouter,
  participantProcedure,
} from "../trpc";
import { z } from "zod";
import {
  ExamAttendanceStatus,
  ExamType,
  PrelimAttendance,
} from "@prisma/client";
import {
  calculateDueDate,
  calculateDueDateFromNow,
} from "../functions/reusable-logic/calculate-duration";
import { prelimParticipantGetAttendance } from "../functions/reusable-logic/prelim-participant-get-attendance";
import { simulParticipantGetAttempt } from "../functions/reusable-logic/simul-participant-get-attempt";

export const ExamRouter = createTRPCRouter({
  participant: createTRPCRouter({
    getExamInfo: participantProcedure
      .input(
        z.object({
          examId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const session = ctx.session;

        if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

        const exam = await ctx.prisma.exam.findUnique({
          where: { id: input.examId },
        });

        if (!exam) throw new TRPCError({ code: "NOT_FOUND" });

        if (exam.type == ExamType.PRELIMARY) {
          const examInfo = await prelimParticipantGetAttendance(ctx, exam);

          return examInfo;
        } else if (exam.type == ExamType.SIMULATION) {
          const simulInfo = await simulParticipantGetAttempt(ctx, exam);

          return simulInfo;
        }

        return null;
      }),

    getAllExam: participantProcedure.query(async ({ ctx }) => {
      const session = ctx.session;

      if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

      const examInfoList = await ctx.prisma.exam.findMany({
        where: {
          ExamEnrollment: {
            some: {
              userId: session.user.id,
            },
          },
        },
      });

      // PrelimInfo Queries

      const prelimExamAttendanceList =
        await ctx.prisma.prelimAttendance.findMany({
          where: {
            userId: session.user.id,
          },
        });

      const prelimExamList = examInfoList
        .filter((examInfo) => examInfo.type == ExamType.PRELIMARY)
        .map((examInfo) => {
          const prelimInfo = prelimExamAttendanceList.find(
            (prelimInfo) => prelimInfo.prelimInfoId == examInfo.id
          );

          return {
            id: examInfo.id,
            name: examInfo.name,
            description: examInfo.description,
            startTime: examInfo.startTime,
            endTime: examInfo.endTime,
            duration: examInfo.duration,
            type: examInfo.type,
            attendance: {
              status: prelimInfo
                ? prelimInfo.status
                : ExamAttendanceStatus.ABSENT,
              durationRemaining: prelimInfo
                ? prelimInfo.durationRemaining
                : examInfo.duration,
              currentNumber: prelimInfo ? prelimInfo.currentNumber : 0,
            },
          };
        });

      // simulInfo Queries

      const simulAttemptList = await ctx.prisma.simulAttempt.findMany({
        where: {
          userId: session.user.id,
        },
      });

      const simulExamList = examInfoList
        .filter((examInfo) => examInfo.type == ExamType.SIMULATION)
        .map((examInfo) => {
          const simulAttempt = simulAttemptList.find(
            (simulAttempt) => simulAttempt.simulInfoId == examInfo.id
          );

          return {
            id: examInfo.id,
            name: examInfo.name,
            description: examInfo.description,
            startTime: examInfo.startTime,
            endTime: examInfo.endTime,
            duration: examInfo.duration,
            type: examInfo.type,
            attendance: {
              status: simulAttempt
                ? simulAttempt.status
                : ExamAttendanceStatus.ABSENT,
              durationRemaining: simulAttempt
                ? simulAttempt.durationRemaining
                : examInfo.duration,
              currentNumber: simulAttempt ? simulAttempt.currentNumber : 0,
            },
          };
        });

      const examList = [...prelimExamList, ...simulExamList];

      return examList;
    }),

    updateStatusConfirmConsent: participantProcedure
      .input(
        z.object({
          examId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = ctx.session;

        if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

        const exam = await ctx.prisma.exam.findUnique({
          where: { id: input.examId },
        });

        if (!exam) throw new TRPCError({ code: "NOT_FOUND" });

        if (exam.type == ExamType.PRELIMARY) {
          const prelimInfo = await ctx.prisma.prelimInfo.findFirst({
            where: { examId: exam.id },
          });

          if (!prelimInfo) throw new TRPCError({ code: "NOT_FOUND" });

          let prelimAttendance = await ctx.prisma.prelimAttendance.findFirst({
            where: {
              prelimInfoId: prelimInfo.id,
              userId: session.user.id,
            },
          });

          // Check for enrollment, if no enrollment available, throw 401
          if (!prelimAttendance) {
            const examEnrollment = await ctx.prisma.examEnrollment.findFirst({
              where: {
                examId: exam.id,
                userId: session.user.id,
              },
            });

            if (!examEnrollment) throw new TRPCError({ code: "FORBIDDEN" });

            prelimAttendance = await ctx.prisma.prelimAttendance.create({
              data: {
                prelimInfoId: prelimInfo.id,
                userId: session.user.id,
                dueDate: calculateDueDateFromNow(exam.duration),
                durationRemaining: exam.duration,
                status: ExamAttendanceStatus.TAKEN,
              },
            });

            return prelimAttendance;
          }

          if (prelimAttendance.status === ExamAttendanceStatus.FINISHED) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already finished the exam",
            });
          }

          if (
            prelimAttendance.status === ExamAttendanceStatus.TAKEN ||
            prelimAttendance.status === ExamAttendanceStatus.PAUSED
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already taken exam",
            });
          }

          const updatedprelimAttendance =
            await ctx.prisma.prelimAttendance.update({
              where: { id: prelimAttendance.id },
              data: {
                status: ExamAttendanceStatus.TAKEN,
              },
            });

          return updatedprelimAttendance;
        } else if (exam.type == ExamType.SIMULATION) {
          const simulInfo = await ctx.prisma.simulInfo.findFirst({
            where: { examId: exam.id },
          });

          if (!simulInfo) throw new TRPCError({ code: "NOT_FOUND" });

          let simulAttempt = await ctx.prisma.simulAttempt.findFirst({
            where: {
              simulInfoId: simulInfo.id,
              userId: session.user.id,
            },
          });

          // Check for enrollment, if no enrollment available, throw 401
          if (!simulAttempt) {
            const examEnrollment = await ctx.prisma.examEnrollment.findFirst({
              where: {
                examId: exam.id,
                userId: session.user.id,
              },
            });

            if (!examEnrollment) throw new TRPCError({ code: "FORBIDDEN" });

            simulAttempt = await ctx.prisma.simulAttempt.create({
              data: {
                simulInfoId: simulInfo.id,
                userId: session.user.id,
                dueDate: calculateDueDateFromNow(exam.duration),
                durationRemaining: exam.duration,
                status: ExamAttendanceStatus.TAKEN,
              },
            });

            return simulAttempt;
          }

          if (simulAttempt.status === ExamAttendanceStatus.FINISHED) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already finished the exam",
            });
          }

          if (
            simulAttempt.status === ExamAttendanceStatus.TAKEN ||
            simulAttempt.status === ExamAttendanceStatus.PAUSED
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already taken exam",
            });
          }

          const updatedSimulAttempt = await ctx.prisma.simulAttempt.update({
            where: { id: simulAttempt.id },
            data: {
              status: ExamAttendanceStatus.TAKEN,
            },
          });

          return updatedSimulAttempt;
        } else {
          return null;
        }
      }),

    updateStatusSubmitExam: participantProcedure
      .input(
        z.object({
          examId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const session = ctx.session;

        if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

        const exam = await ctx.prisma.exam.findUnique({
          where: { id: input.examId },
        });

        if (!exam) throw new TRPCError({ code: "NOT_FOUND" });

        if (exam.type == ExamType.PRELIMARY) {
          const prelimInfo = await ctx.prisma.prelimInfo.findFirst({
            where: { examId: exam.id },
          });

          if (!prelimInfo) throw new TRPCError({ code: "NOT_FOUND" });

          let prelimAttendance = await ctx.prisma.prelimAttendance.findFirst({
            where: {
              prelimInfoId: prelimInfo.id,
              userId: session.user.id,
            },
          });

          // Check for enrollment, if no enrollment available, throw 401
          if (!prelimAttendance) {
            const examEnrollment = await ctx.prisma.examEnrollment.findFirst({
              where: {
                examId: exam.id,
                userId: session.user.id,
              },
            });

            if (!examEnrollment) throw new TRPCError({ code: "FORBIDDEN" });

            prelimAttendance = await ctx.prisma.prelimAttendance.create({
              data: {
                prelimInfoId: prelimInfo.id,
                userId: session.user.id,
                dueDate: calculateDueDateFromNow(exam.duration),
                durationRemaining: exam.duration,
                status: ExamAttendanceStatus.TAKEN,
              },
            });

            return prelimAttendance;
          }

          if (prelimAttendance.status === ExamAttendanceStatus.FINISHED) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "User already finished the exam",
            });
          }

          const updatedprelimAttendance =
            await ctx.prisma.prelimAttendance.update({
              where: { id: prelimAttendance.id },
              data: {
                status: ExamAttendanceStatus.FINISHED,
              },
            });

          return updatedprelimAttendance;
        } else {
          return null;
        }
      }),
  }),
  admin: createTRPCRouter({
    getAllExam: adminProcedure.query(async ({ ctx }) => {
      const examList = await ctx.prisma.exam.findMany(); // search query not needed

      return examList;
    }),

    getAllAttendanceByExamId: adminProcedure
      .input(
        z.object({
          examId: z.string(),
          currentPage: z.number(),
          rowPerPage: z.number(),
          orderBy: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const exam = await ctx.prisma.exam.findUnique({
          where: { id: input.examId },
        });

        if (!exam) throw new TRPCError({ code: "NOT_FOUND" });

        if (exam.type == ExamType.PRELIMARY) {
          const prelimInfo = await ctx.prisma.prelimInfo.findFirst({
            where: { examId: exam.id },
          });

          if (!prelimInfo) throw new TRPCError({ code: "NOT_FOUND" });

          const prelimAttendanceList =
            await ctx.prisma.prelimAttendance.findMany({
              where: { prelimInfoId: prelimInfo.id },
              include: {
                user: {
                  include: {
                    MainCompetitionRegistrationData: true,
                  },
                },
              },
              skip: (input.currentPage - 1) * input.rowPerPage,
              take: input.rowPerPage,
            });

          const prelimAttendanceListCount =
            await ctx.prisma.prelimAttendance.count({
              where: { prelimInfoId: prelimInfo.id },
            });

          return {
            data: prelimAttendanceList,
            metadata: { totalCount: prelimAttendanceListCount },
          };
        } else {
          return {
            data: [],
            metadata: { totalCount: 0 },
          };
        }
      }),

    updateAttendanceById: adminProcedure
      .input(
        z.object({
          prelimAttendanceId: z.string(),
          status: z.enum([
            ExamAttendanceStatus.ABSENT,
            ExamAttendanceStatus.TAKEN,
            ExamAttendanceStatus.PAUSED,
            ExamAttendanceStatus.FINISHED,
          ]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const prelimAttendance = await ctx.prisma.prelimAttendance.findUnique({
          where: { id: input.prelimAttendanceId },
        });

        if (!prelimAttendance) throw new TRPCError({ code: "NOT_FOUND" });

        const updatedPrelimAttendance =
          await ctx.prisma.prelimAttendance.update({
            where: { id: input.prelimAttendanceId },
            data: {
              status: input.status,
            },
          });

        return updatedPrelimAttendance;
      }),

    deleteAttendanceById: adminProcedure
      .input(
        z.object({
          prelimAttendanceId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const prelimAttendance = await ctx.prisma.prelimAttendance.findUnique({
          where: { id: input.prelimAttendanceId },
        });

        if (!prelimAttendance)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User attendance not found",
          });

        const deletedPrelimAttendance =
          await ctx.prisma.prelimAttendance.delete({
            where: { id: input.prelimAttendanceId },
          });

        return deletedPrelimAttendance;
      }),
  }),
});
