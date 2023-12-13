import {
  ExamAttendanceStatus,
  SimulAttempt,
  SimulAttemptPhase,
  SimulInfo,
} from "@prisma/client";
import moment from "moment";
import { ContextType } from "../../trpc";
import { calculateDueDateFromNow } from "./calculate-duration";

export const simulValidateTiming = async (
  ctx: ContextType,
  simulAttempt: SimulAttempt & { simulInfo: SimulInfo },
  qNumber: number,
  problemDuration: number
) => {
  let newSimulAttempt = simulAttempt as SimulAttempt;

  // if (simulAttempt.phase === SimulAttemptPhase.IDLE) {
  //   newSimulAttempt = await ctx.prisma.simulAttempt.update({
  //     where: {
  //       id: simulAttempt.id,
  //     },
  //     data: {
  //       phase: SimulAttemptPhase.ATTEMPTING,
  //       currentNumber: qNumber,
  //       dueDate: calculateDueDateFromNow(problemDuration),
  //     },
  //   });
  // }

  if (
    moment().isAfter(moment(simulAttempt.dueDate)) &&
    (simulAttempt.phase === SimulAttemptPhase.REDO_ATTEMPTING ||
      simulAttempt.phase === SimulAttemptPhase.ATTEMPTING)
  ) {
    console.log("isAfter");
    console.log(newSimulAttempt);
    newSimulAttempt = await ctx.prisma.simulAttempt.update({
      where: {
        id: simulAttempt.id,
      },
      data: {
        currentNumber:
          newSimulAttempt.phase === SimulAttemptPhase.ATTEMPTING
            ? simulAttempt.simulInfo.noOfQuestions <= qNumber
              ? -1
              : qNumber + 1
            : -1,
        dueDate: new Date(),
        phase:
          newSimulAttempt.phase === SimulAttemptPhase.ATTEMPTING
            ? simulAttempt.simulInfo.noOfQuestions <= qNumber
              ? SimulAttemptPhase.REDO_IDLE
              : SimulAttemptPhase.IDLE
            : SimulAttemptPhase.FINISHED,
        status:
          newSimulAttempt.phase === SimulAttemptPhase.REDO_ATTEMPTING
            ? ExamAttendanceStatus.FINISHED
            : undefined,
      },
    });
    console.log(newSimulAttempt);
  }

  const remainingDuration = moment(simulAttempt.dueDate).diff(moment(), "ms");

  return { remainingDuration, simulAttempt };
};
