import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { ExamAttendanceStatus, ExamType } from "@prisma/client";
import { api } from "~/utils/api";
import { PrelimExam } from "./PrelimExam";
import { Loading } from "../common/Loading";
import moment from "moment";
import { useEffect } from "react";
import HtmlParser from "react-html-parser";
import { SimulExam } from "./SimulExam";

interface ExamGateProps {
  examId: string;
  setTitle: (title: string) => void;
}

export const ExamGate = ({ examId, setTitle }: ExamGateProps) => {
  const toast = useToast();

  const examInfoQuery = api.exam.participant.getExamInfo.useQuery({ examId });
  const updateExamConfirmConsentMutation =
    api.exam.participant.updateStatusConfirmConsent.useMutation();
  const examInfo = examInfoQuery.data;

  const confirmConsent = () => {
    updateExamConfirmConsentMutation
      .mutateAsync({ examId })
      .then(() => examInfoQuery.refetch())
      .then(() => {
        toast({
          title: "Exam Started",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (examInfo) {
      setTitle(examInfo.name);
    }
  }, [examInfo, setTitle]);

  if (examInfo?.attendance.status === ExamAttendanceStatus.ABSENT) {
    return (
      <Flex flexDir="column" px="25%">
        <Text
          fontSize="2xl"
          color="blue"
          fontFamily="heading"
          fontWeight="bold"
          my="1em"
          textAlign="center"
          w="100%"
        >
          {examInfo.name}
        </Text>
        {HtmlParser(examInfo.description)}

        {moment().isBefore(examInfo.startTime) ? (
          <Text textAlign="center" w="100%">
            Exam will start at {examInfo.startTime.toLocaleString()}
          </Text>
        ) : moment().isAfter(examInfo.endTime) ? (
          <Text textAlign="center" w="100%">
            Exam has ended
          </Text>
        ) : (
          <Button onClick={confirmConsent}>Start Exam</Button>
        )}
      </Flex>
    );
  }

  if (examInfo?.attendance.status === ExamAttendanceStatus.FINISHED) {
    return (
      <Flex justifyContent="center">
        You have finished your exam, please wait for the result!
      </Flex>
    );
  }

  if (examInfo?.type === ExamType.PRELIMARY) {
    return <PrelimExam examId={examId} />;
  }

  if (examInfo?.type === ExamType.SIMULATION) {
    return <SimulExam examId={examId} />;
  }

  console.log(examInfo)

  if (examInfoQuery.isLoading) {
    return <Loading />;
  }

  return <Flex justifyContent="center">Error... Thats all we know</Flex>;
};
