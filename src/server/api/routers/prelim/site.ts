import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  participantProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { ExamAttendanceStatus, FlagStatus, ProblemType } from "@prisma/client";
import {
  calculateDueDate,
  calculateDueDateFromNow,
  calculateDuration,
} from "../../functions/reusable-logic/calculate-duration";

export const prelimSiteRouter = createTRPCRouter({
  participant: createTRPCRouter({
    getPrelimInfo: participantProcedure
      .input(
        z.object({
          examId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const examInfo = await ctx.prisma.prelimInfo.findFirstOrThrow({
          where: {
            examId: input.examId,
          },
          include: {
            ProblemData: true,
            exam: true,
          },
        });

        if (moment().isBefore(examInfo.startTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has not started.",
          });
        if (moment().isAfter(examInfo.endTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has ended.",
          });

        const { exam } = examInfo;

        const prelimAttendance = await ctx.prisma.prelimAttendance.findFirst({
          where: {
            prelimInfoId: examInfo.id,
          },
          include: {
            answerData: true,
          },
        });

        // Case first time to take exam
        if (!prelimAttendance) {
          const enrollmentInfo = await ctx.prisma.examEnrollment.findFirst({
            where: {
              examId: examInfo.examId,
              userId: ctx.session?.user.id,
            },
          });

          if (!enrollmentInfo)
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You are not enrolled on this exam.",
            });

          const createdPrelimAttendance =
            await ctx.prisma.prelimAttendance.create({
              data: {
                prelimInfoId: examInfo.id,
                userId: ctx.session?.user.id,
                durationRemaining: exam.duration,
                status: ExamAttendanceStatus.TAKEN,
                dueDate: calculateDueDateFromNow(exam.duration),
              },
            });

          const returnedExamInfo = {
            ...examInfo,
            durationRemaining: exam.duration,
            answerData: [],
          };

          return returnedExamInfo;
        }

        const durationRemaining =
          prelimAttendance.status === ExamAttendanceStatus.TAKEN
            ? calculateDuration(prelimAttendance.dueDate)
            : prelimAttendance.durationRemaining;

        if (durationRemaining === 0)
          throw new TRPCError({ code: "FORBIDDEN", message: "Time is out." });

        const returnedExamInfo = {
          ...examInfo,
          durationRemaining: durationRemaining,
          answerData: prelimAttendance.answerData,
        };

        return returnedExamInfo;
      }),

    setFlag: participantProcedure
      .input(
        z.object({
          examId: z.string(),
          answerDataId: z.string(),
          flagStatus: z.enum([
            FlagStatus.ANSWERED,
            FlagStatus.FLAGGED,
            FlagStatus.UNANSWERED,
          ]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const examInfo = await ctx.prisma.prelimInfo.findFirstOrThrow({
          where: {
            examId: input.examId,
          },
        });

        if (moment().isBefore(examInfo.startTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has not started.",
          });
        if (moment().isAfter(examInfo.endTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has ended.",
          });

        const prelimAttendance =
          await ctx.prisma.prelimAttendance.findFirstOrThrow({
            where: {
              prelimInfoId: examInfo.id,
            },
          });

        if (prelimAttendance.durationRemaining === 0)
          throw new TRPCError({ code: "FORBIDDEN", message: "Time is out." });

        const answerData = await ctx.prisma.answerData.findFirst({
          where: {
            id: input.answerDataId,
          },
        });

        if (answerData) {
          const updatedAnswerData = await ctx.prisma.answerData.update({
            where: {
              id: answerData.id,
            },
            data: {
              flagStatus: input.flagStatus,
            },
          });

          return updatedAnswerData;
        }

        const createdAnswerData = await ctx.prisma.answerData.create({
          data: {
            flagStatus: input.flagStatus,
            prelimAttendanceId: prelimAttendance.id,
          },
        });

        return createdAnswerData;
      }),

    getPrelimQue: participantProcedure
      .input(
        z.object({
          examId: z.string(),
          questionNumber: z.number(),
        })
      )
      .query(async ({ ctx, input }) => {
        const examInfo = await ctx.prisma.prelimInfo.findFirstOrThrow({
          where: {
            examId: input.examId,
          },
        });

        if (moment().isBefore(examInfo.startTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has not started.",
          });
        if (moment().isAfter(examInfo.endTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has ended.",
          });

        const prelimAttendance =
          await ctx.prisma.prelimAttendance.findFirstOrThrow({
            where: {
              prelimInfoId: examInfo.id,
            },
          });

        const durationRemaining =
          prelimAttendance.status === ExamAttendanceStatus.TAKEN
            ? calculateDuration(prelimAttendance.dueDate)
            : prelimAttendance.durationRemaining;

        if (durationRemaining === 0)
          throw new TRPCError({ code: "FORBIDDEN", message: "Time is out." });

        const problemData = await ctx.prisma.problemData.findFirst({
          where: {
            prelimInfoId: examInfo.id,
            pNumber: input.questionNumber,
          },
          include: {
            ExamMultipleChoice: true,
            ExamShortAnswer: true,
          },
        });

        if (!problemData)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Question not found, please contact support.",
          });

        let answerData = await ctx.prisma.answerData.findFirst({
          where: {
            prelimAttendanceId: prelimAttendance.id,
            problemDataId: problemData.id,
          },
        });

        if (!answerData) {
          const createdAnswerData = await ctx.prisma.answerData.create({
            data: {
              prelimAttendanceId: prelimAttendance.id,
              problemDataId: problemData.id,
              flagStatus: FlagStatus.UNANSWERED,
            },
          });

          answerData = createdAnswerData;
        }

        const problemContent =
          problemData.problemType === ProblemType.MC
            ? problemData.ExamMultipleChoice[0]
            : problemData.ExamShortAnswer[0];

        if (!problemContent)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Question not found.",
          });

        const prelimQue = {
          content: problemContent,
          answerData: answerData,
          type: problemData.problemType,
          pNumber: input.questionNumber,
        };

        return prelimQue as
          | {
              content: (typeof problemData.ExamMultipleChoice)[0];
              type: "MC";
              pNumber: number;
              answerData: typeof answerData;
            }
          | {
              content: (typeof problemData.ExamShortAnswer)[0];
              type: "SA";
              pNumber: number;
              answerData: typeof answerData;
            };
      }),

    submitPrelimAnswer: participantProcedure
      .input(
        z.object({
          examId: z.string(),
          questionNumber: z.number(),
          answer: z.string(),
          flagStatus: z
            .enum([
              FlagStatus.ANSWERED,
              FlagStatus.FLAGGED,
              FlagStatus.UNANSWERED,
            ])
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const examInfo = await ctx.prisma.prelimInfo.findFirstOrThrow({
          where: {
            examId: input.examId,
          },
        });

        if (moment().isBefore(examInfo.startTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has not started.",
          });
        if (moment().isAfter(examInfo.endTime))
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Exam has ended.",
          });

        const prelimAttendance =
          await ctx.prisma.prelimAttendance.findFirstOrThrow({
            where: {
              prelimInfoId: examInfo.id,
            },
            select: {
              durationRemaining: true,
              id: true,
            },
          });

        if (prelimAttendance.durationRemaining === 0)
          throw new TRPCError({ code: "FORBIDDEN", message: "Time is out." });

        const problemData = await ctx.prisma.problemData.findFirstOrThrow({
          where: {
            prelimInfoId: examInfo.id,
            pNumber: input.questionNumber,
          },
          include: {
            ExamMultipleChoice: true,
            ExamShortAnswer: true,
          },
        });

        const examContent =
          problemData.problemType === ProblemType.MC
            ? problemData.ExamMultipleChoice[0]
            : problemData.ExamShortAnswer[0];

        if (!examContent)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Question not found.",
          });

        // Check if answerData already exists, if not, create it
        const prelimAnswer = await ctx.prisma.answerData.findFirst({
          where: {
            prelimAttendanceId: prelimAttendance.id,
            problemDataId: problemData.id,
          },
        });

        if (prelimAnswer) {
          const updatedPrelimAnswer = await ctx.prisma.answerData.update({
            where: {
              id: prelimAnswer.id,
            },
            data: {
              answer: input.answer,
              flagStatus: input.flagStatus,
            },
          });

          return updatedPrelimAnswer;
        } else {
          const createdPrelimAnswer = await ctx.prisma.answerData.create({
            data: {
              prelimAttendanceId: prelimAttendance.id,
              problemDataId: problemData.id,
              answer: input.answer,
              flagStatus: input.flagStatus ?? FlagStatus.ANSWERED,
            },
          });

          return createdPrelimAnswer;
        }
      }),
  }),
});
