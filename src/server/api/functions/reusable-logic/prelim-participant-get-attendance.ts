import {
  Exam,
  ExamAttendanceStatus,
  PrelimInfo,
  PrismaClient,
} from "@prisma/client";
import { ContextType } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { calculateDueDateFromNow } from "./calculate-duration";

export const prelimParticipantGetAttendance = async (
  ctx: ContextType,
  exam: Exam
) => {
  const prelimInfo = await ctx.prisma.prelimInfo.findFirst({
    where: { examId: exam.id },
  });

  if (!prelimInfo)
    throw new TRPCError({ code: "NOT_FOUND", message: "Wrong link" });

  const { session } = ctx;

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

    if (!examEnrollment)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not enrolled in this exam",
      });

    prelimAttendance = await ctx.prisma.prelimAttendance.create({
      data: {
        prelimInfoId: prelimInfo.id,
        userId: session.user.id,
        dueDate: calculateDueDateFromNow(exam.duration),
        durationRemaining: exam.duration,
        status: ExamAttendanceStatus.ABSENT,
      },
    });
  }

  if (!prelimAttendance) throw new TRPCError({ code: "FORBIDDEN" });

  const examInfo = {
    id: exam.id,
    name: exam.name,
    description: exam.description,
    startTime: exam.startTime,
    endTime: exam.endTime,
    duration: exam.duration,
    type: exam.type,
    attendance: {
      status: prelimAttendance.status,
      durationRemaining: prelimAttendance.durationRemaining,
      currentNumber: prelimAttendance.currentNumber,
    },
  };

  return examInfo;
};
