import {
    Exam,
    ExamAttendanceStatus,
    SimulInfo,
    PrismaClient,
  } from "@prisma/client";
  import { ContextType } from "../../trpc";
  import { TRPCError } from "@trpc/server";
  import { calculateDueDateFromNow } from "./calculate-duration";
  
  export const simulParticipantGetAttempt = async (
    ctx: ContextType,
    exam: Exam
  ) => {
    const simulInfo = await ctx.prisma.simulInfo.findFirst({
      where: { examId: exam.id },
    });
  
    if (!simulInfo)
      throw new TRPCError({ code: "NOT_FOUND", message: "Wrong link" });
  
    const { session } = ctx;
  
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
  
      if (!examEnrollment)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not enrolled in this exam",
        });
  
      simulAttempt = await ctx.prisma.simulAttempt.create({
        data: {
          simulInfoId: simulInfo.id,
          userId: session.user.id,
          dueDate: calculateDueDateFromNow(exam.duration),
          durationRemaining: exam.duration,
          status: ExamAttendanceStatus.ABSENT,
        },
      });
    }
  
    if (!simulAttempt) throw new TRPCError({ code: "FORBIDDEN" });
  
    const examInfo = {
      id: exam.id,
      name: exam.name,
      description: exam.description,
      startTime: exam.startTime,
      endTime: exam.endTime,
      duration: exam.duration,
      type: exam.type,
      attendance: {
        status: simulAttempt.status,
        durationRemaining: simulAttempt.durationRemaining,
        currentNumber: simulAttempt.currentNumber,
      },
    };
  
    return examInfo;
  };
  