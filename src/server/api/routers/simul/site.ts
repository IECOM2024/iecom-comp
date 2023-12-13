import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  participantProcedure,
} from "~/server/api/trpc";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import {
  ExamAttendanceStatus,
  FlagStatus,
  ProblemType,
  SimulAttemptPhase,
} from "@prisma/client";
import {
  calculateDueDate,
  calculateDueDateFromNow,
  calculateDuration,
} from "../../functions/reusable-logic/calculate-duration";
import { simulValidateTiming } from "../../functions/reusable-logic/simul-validate-timing";

export const simulSiteRouter = createTRPCRouter({
  getSimulInfo: participantProcedure
    .input(
      z.object({
        examId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { examId } = input;

      const exam = await ctx.prisma.exam.findUnique({
        where: {
          id: examId,
        },
      });

      if (!exam) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exam not found" });
      }

      const examEnrollment = await ctx.prisma.examEnrollment.findFirst({
        where: {
          examId,
          userId: ctx.session.user.id,
        },
      });

      if (!examEnrollment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You have not enrolled on this exam",
        });
      }

      const simulInfo = await ctx.prisma.simulInfo.findFirst({
        where: {
          examId,
        },
      });

      if (!simulInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul info not found",
        });
      }

      const simulAttempt = await ctx.prisma.simulAttempt.findFirst({
        where: {
          simulInfoId: simulInfo.id,
          userId: ctx.session.user.id,
        },
      });

      if (!simulAttempt) {
        const newSimulAttempt = await ctx.prisma.simulAttempt.create({
          data: {
            simulInfoId: simulInfo.id,
            userId: ctx.session.user.id,
            status: ExamAttendanceStatus.TAKEN,
            phase: SimulAttemptPhase.IDLE,
            dueDate: Date(),
          },
        });

        const simulQuestions = await ctx.prisma.simulProblem.findMany({
          where: {
            simulInfoId: simulInfo.id,
          },
        });

        return {
          simulQuestions,
          simulInfo,
          simulAttempt: newSimulAttempt,
        };
      }

      const simulQuestions = await ctx.prisma.simulProblem.findMany({
        where: {
          simulInfoId: simulInfo.id,
        },
      });

      const { remainingDuration, simulAttempt: newSimulAttempt } =
        await simulValidateTiming(
          ctx,
          { ...simulAttempt, simulInfo },
          simulAttempt.currentNumber,
          simulQuestions.find((q) => q.pNumber === simulAttempt.currentNumber)
            ?.problemDuration ?? 0
        );

      if (remainingDuration === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Your time is up" });
      }

      const returnedSimulQuestions = simulQuestions.sort((a,b) => a.pNumber - b.pNumber)

      return {
        simulQuestions: returnedSimulQuestions,
        simulInfo,
        simulAttempt: newSimulAttempt,
        remainingDuration,
      };
    }),

  getSimulProblemDataImperative: participantProcedure
    .input(
      z.object({
        qNumber: z.number(),
        simulInfoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { qNumber, simulInfoId } = input;

      const simulInfo = await ctx.prisma.simulInfo.findFirst({
        where: {
          id: simulInfoId,
        },
      });

      if (!simulInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul info not found",
        });
      }

      let simulAttempt = await ctx.prisma.simulAttempt.findFirst({
        where: {
          simulInfoId: simulInfo.id,
          userId: ctx.session.user.id,
        },
      });

      if (!simulAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul attempt not found",
        });
      }

      if (qNumber !== simulAttempt.currentNumber) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are forbidden to take this question",
        });
      }

      const simulProblem = await ctx.prisma.simulProblem.findFirst({
        where: {
          simulInfoId: simulInfo.id,
          pNumber: qNumber,
        },
      });

      if (!simulProblem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul problem not found",
        });
      }

      if (
        simulAttempt.phase === SimulAttemptPhase.IDLE ||
        simulAttempt.phase === SimulAttemptPhase.REDO_IDLE
      ) {
        simulAttempt = await ctx.prisma.simulAttempt.update({
          where: {
            id: simulAttempt.id,
          },
          data: {
            phase:
              simulAttempt.phase === SimulAttemptPhase.REDO_IDLE
                ? SimulAttemptPhase.REDO_ATTEMPTING
                : SimulAttemptPhase.ATTEMPTING,
            currentNumber: qNumber,
            dueDate: calculateDueDateFromNow(simulProblem?.problemDuration),
          },
        });
      }

      if (moment().isAfter(moment(simulAttempt.dueDate))) {
        simulAttempt = await ctx.prisma.simulAttempt.update({
          where: {
            id: simulAttempt.id,
          },
          data: {
            phase: SimulAttemptPhase.IDLE,
            currentNumber: qNumber + 1,
            dueDate: new Date(),
          },
        });
      }

      // RETURNS
      const simulAnswer = await ctx.prisma.simulAnswer.findFirst({
        where: {
          simulProblemId: simulProblem.id,
          simulAttemptId: simulAttempt.id,
        },
      });

      if (!simulAnswer) {
        const newSimulAnswer = await ctx.prisma.simulAnswer.create({
          data: {
            simulProblemId: simulProblem.id,
            simulAttemptId: simulAttempt.id,
          },
        });

        return {
          simulProblem,
          simulAttempt,
          simulAnswer: newSimulAnswer,
        };
      }

      return {
        simulProblem,
        simulAttempt,
        simulAnswer,
      };
    }),

  saveSimulAnswer: participantProcedure
    .input(
      z.object({
        simulProblemId: z.string(),
        simulAttemptId: z.string(),
        fileUploadLink: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { simulProblemId, simulAttemptId, fileUploadLink } = input;

      const simulProblem = await ctx.prisma.simulProblem.findFirst({
        where: {
          id: simulProblemId,
        },
      });

      if (!simulProblem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul problem not found",
        });
      }

      let simulAttempt = await ctx.prisma.simulAttempt.findFirst({
        where: {
          id: simulAttemptId,
        },
      });

      if (!simulAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul attempt not found",
        });
      }

      const simulInfo = await ctx.prisma.simulInfo.findUnique({
        where: {
          id: simulAttempt.simulInfoId,
        },
      });

      if (!simulInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul info not found",
        });
      }

      const qNumber = simulProblem.pNumber;

      if (
        simulAttempt.phase === SimulAttemptPhase.IDLE ||
        simulAttempt.phase === SimulAttemptPhase.REDO_IDLE
      ) {
        simulAttempt = await ctx.prisma.simulAttempt.update({
          where: {
            id: simulAttempt.id,
          },
          data: {
            phase:
              simulAttempt.phase === SimulAttemptPhase.REDO_IDLE
                ? SimulAttemptPhase.REDO_ATTEMPTING
                : SimulAttemptPhase.ATTEMPTING,
            currentNumber: qNumber,
            dueDate: calculateDueDateFromNow(simulProblem?.problemDuration),
          },
        });
      }

      if (moment().isAfter(moment(simulAttempt.dueDate))) {
        if (qNumber + 1 >= simulInfo.noOfQuestions) {
          const redoSimulAttempt = await ctx.prisma.simulAttempt.update({
            where: {
              id: simulAttempt.id,
            },
            data: {
              phase: SimulAttemptPhase.REDO_IDLE,
              currentNumber: simulInfo.noOfQuestions + 1,
              dueDate: Date(),
            },
          });
        }

        const endedSimulAttempt = await ctx.prisma.simulAttempt.update({
          where: {
            id: simulAttempt.id,
          },
          data: {
            phase: SimulAttemptPhase.IDLE,
            currentNumber: qNumber + 1,
            dueDate: Date(),
          },
        });

        throw new TRPCError({ code: "FORBIDDEN", message: "Your time is up" });
      }

      const simulAnswer = await ctx.prisma.simulAnswer.findFirst({
        where: {
          simulProblemId,
          simulAttemptId,
        },
      });

      if (!simulAnswer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul answer not found",
        });
      }

      const updatedSimulAnswer = await ctx.prisma.simulAnswer.update({
        where: {
          id: simulAnswer.id,
        },
        data: {
          fileUploadLink,
        },
      });

      return updatedSimulAnswer;
    }),

  submitSimulAnswer: participantProcedure
    .input(
      z.object({
        simulInfoId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { simulInfoId } = input;

      const simulInfo = await ctx.prisma.simulInfo.findFirst({
        where: {
          id: simulInfoId,
        },
      });

      if (!simulInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul info not found",
        });
      }

      let simulAttempt = await ctx.prisma.simulAttempt.findFirst({
        where: {
          simulInfoId: simulInfo.id,
          userId: ctx.session.user.id,
        },
      });

      if (!simulAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul attempt not found",
        });
      }

      simulAttempt = await ctx.prisma.simulAttempt.update({
        where: {
          id: simulAttempt.id,
        },
        data: {
          phase:
            simulInfo.noOfQuestions <= simulAttempt.currentNumber
              ? SimulAttemptPhase.REDO_IDLE
              : SimulAttemptPhase.IDLE,
          currentNumber:
            simulInfo.noOfQuestions <= simulAttempt.currentNumber
              ? -1
              : simulInfo.noOfQuestions + 1,
          dueDate: Date(),
        },
      });

      return simulAttempt;
    }),

  setRedoProblem: participantProcedure
    .input(
      z.object({
        simulInfoId: z.string(),
        qNumber: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { simulInfoId, qNumber } = input;

      const simulInfo = await ctx.prisma.simulInfo.findFirst({
        where: {
          id: simulInfoId,
        },
      });

      if (!simulInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul info not found",
        });
      }

      let simulAttempt = await ctx.prisma.simulAttempt.findFirst({
        where: {
          simulInfoId: simulInfo.id,
          userId: ctx.session.user.id,
        },
      });

      if (!simulAttempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simul attempt not found",
        });
      }

      if (simulAttempt.phase !== SimulAttemptPhase.REDO_IDLE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to redo any question",
        });
      }

      const simulProblem = await ctx.prisma.simulProblem.findFirst({
        where: {
          simulInfoId: simulInfo.id,
          pNumber: qNumber,
        },
      });

      simulAttempt = await ctx.prisma.simulAttempt.update({
        where: {
          id: simulAttempt.id,
        },
        data: {
          phase: SimulAttemptPhase.REDO_ATTEMPTING,
          currentNumber: qNumber,
          dueDate: calculateDueDateFromNow(simulProblem?.problemDuration ?? 0),
        },
      });

      return simulAttempt;
    }),
});
