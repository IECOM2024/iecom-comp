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

      const examList = [...prelimExamList];

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
  }),
});
