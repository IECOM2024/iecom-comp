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
import { FlagStatus, ProblemType } from "@prisma/client";

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
          }
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
            include: {
              answerData: true,
            },
          });

        if (prelimAttendance.durationRemaining === 0)
          throw new TRPCError({ code: "FORBIDDEN", message: "Time is out." });

        const returnedExamInfo = {
          ...examInfo,
          durationRemaining: prelimAttendance.durationRemaining,
          answerData: prelimAttendance.answerData,
        };

        return returnedExamInfo;
      }),

    setFlag: participantProcedure.input(z.object({
      examId: z.string(),
      answerDataId: z.string(),
      flagStatus: z.enum([FlagStatus.ANSWERED, FlagStatus.FLAGGED, FlagStatus.UNANSWERED]),
    })).mutation(async ({ ctx, input }) => {
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
            select: {
              durationRemaining: true,
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

        const prelimQue = {
          content: examContent,
          type: problemData.problemType,
          pNumber: input.questionNumber,
        };

        return prelimQue;
      }),

    submitPrelimAnswer: participantProcedure
      .input(
        z.object({
          examId: z.string(),
          questionNumber: z.number(),
          answer: z.string(),
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
            },
          });

          return updatedPrelimAnswer;
        } else {
          const createdPrelimAnswer = await ctx.prisma.answerData.create({
            data: {
              prelimAttendanceId: prelimAttendance.id,
              problemDataId: problemData.id,
              answer: input.answer,
            },
          });

          return createdPrelimAnswer;
        }
      }),
  }),
});
