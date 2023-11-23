import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FlagStatus } from "@prisma/client";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import moment from "moment";
import { MdFlag } from "react-icons/md";
import { Loading } from "../../common/Loading";
import { BtnSubmitConsent } from "./SubmitConsentBtn";
import ReactHtmlParser from 'react-html-parser';

interface PrelimExamProps {
  examId: string;
}

export const PrelimExam = ({ examId }: PrelimExamProps) => {
  const toast = useToast();
  const router = useRouter();

  const [pNumber, setPNumber] = useState(1);
  const [currentQ, setCurrentQ] = useState(1);
  const [answer, setAnswer] = useState("" as string);

  const [remainingTime, setRemainingTime] = useState(0);

  const prelimInfoQuery = api.prelim.site.participant.getPrelimInfo.useQuery({
    examId: examId,
  });
  const prelimSubmitExamMutation =
    api.exam.participant.updateStatusSubmitExam.useMutation();

  const prelimInfo = prelimInfoQuery.data;
  const allAnswerData = prelimInfo?.answerData;
  const allProblemData = prelimInfo?.ProblemData;
  const noOfQuestions = prelimInfo?.noOfQuestions ?? 0;

  const mergedProblemAnswerData =
    allProblemData?.map((problem) => {
      const answerData = allAnswerData?.find(
        (answer) => answer.problemDataId === problem.id
      );

      if (!answerData) return { ...problem, answerData: null };

      return {
        ...problem,
        answerData: answerData,
      };
    }) ?? [];

  const problemDataQuery = api.prelim.site.participant.getPrelimQue.useQuery({
    examId: examId,
    questionNumber: pNumber,
  });

  const problemData = problemDataQuery.data;

  const setFlagMutation = api.prelim.site.participant.setFlag.useMutation();

  const submitAnswerMutation =
    api.prelim.site.participant.submitPrelimAnswer.useMutation();

  useEffect(() => {
    if (prelimInfo?.durationRemaining) {
      setRemainingTime(prelimInfo.durationRemaining);
      const interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [prelimInfo?.durationRemaining]);

  useEffect(() => {
    if (problemData?.answerData?.answer) {
      setAnswer(problemData.answerData.answer);
    }
  }, [problemData?.answerData?.answer]);

  useEffect(() => {
    if (remainingTime <= 0) {
      
    }
  });

  if (!prelimInfo) {
    return <Loading />;
  }

  const submitExam = () => {
    prelimSubmitExamMutation.mutateAsync({ examId: examId }).then(() => {
      toast({
        title: "Exam Submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000);
    });
  };

  const { answerData } = problemData ?? {};

  const submitAnswer = () => {
    if (!problemData?.answerData.id || !examId || !answer) return;

    submitAnswerMutation
      .mutateAsync({
        examId: examId,
        answer: answer,
        questionNumber: pNumber,
        flagStatus:
          answerData?.flagStatus === FlagStatus.FLAGGED
            ? FlagStatus.FLAGGED
            : FlagStatus.ANSWERED,
      })
      .then(() => {
        prelimInfoQuery.refetch();
        problemDataQuery.refetch();
      });
  };

  const nextPage = () => {
    if (currentQ < noOfQuestions) {
      setCurrentQ(currentQ + 1);
      setPNumber(pNumber + 1);
      setAnswer("");
    } else {
      setCurrentQ(1);
    }

    if (answerData?.answer !== answer) {
      submitAnswer();
    }
  };

  const prevPage = () => {
    if (currentQ > 1) {
      setCurrentQ(currentQ - 1);
      setPNumber(pNumber - 1);
      setAnswer("");
    } else {
      setCurrentQ(noOfQuestions);
    }

    if (answerData?.answer !== answer) {
      submitAnswer();
    }
  };

  const jumpToPage = (page: number) => {
    setCurrentQ(page);
    setPNumber(page);

    if (answerData?.answer !== answer) {
      submitAnswer();
    }
    setAnswer("");
  };

  const toggleFlag = () => {
    console.log(problemData?.answerData.id, examId);
    if (!problemData?.answerData.id || !examId) return;

    setFlagMutation
      .mutateAsync({
        examId: examId,
        answerDataId: problemData?.answerData.id,
        flagStatus:
          problemData?.answerData.flagStatus === FlagStatus.FLAGGED
            ? problemData?.answerData.answer
              ? FlagStatus.ANSWERED
              : FlagStatus.UNANSWERED
            : FlagStatus.FLAGGED,
      })
      .then(() => {
        prelimInfoQuery.refetch();
        problemDataQuery.refetch();
      });
  };

  const isAnsweredAll = mergedProblemAnswerData.every(
    (problem) => problem.answerData?.answer
  );

  return (
    <Flex height="100%">
      <Box width="70vw" height="100%" bgColor="cream">
        {problemDataQuery.isLoading ? (
          <Loading />
        ) : problemData ? (
          <Flex
            direction="column"
            position="relative"
            padding="3rem 1.5rem"
            gap="1.5rem"
            zIndex="2"
            fontSize="1.5rem"
            fontFamily="Arial"
            paddingLeft="3rem"
            bg="/comp-light.png"
          >
            <VStack align="flex-start">
              <Text fontWeight="semibold" mb="2rem">
                Question {currentQ}
              </Text>
              <Text className="prelim-question-wrapper">{ReactHtmlParser(problemData.content.question)}</Text>
            </VStack>
            {problemData.type === "MC" ? (
              <VStack
                spacing={2}
                paddingBlock="1rem"
                align="flex-start"
                paddingLeft="3rem"
                zIndex="2"
              >
                <Text fontSize="1.125rem">Choose one:</Text>
                <RadioGroup value={answer} onChange={setAnswer}>
                  <Stack spacing={4} paddingLeft="1rem">
                    <Radio colorScheme="linkedin" value="A">
                      {problemData.content.answerA}
                    </Radio>
                    <Radio colorScheme="linkedin" value="B">
                      {problemData.content.answerB}
                    </Radio>
                    {problemData.content.answerC && (
                      <>
                        <Radio colorScheme="linkedin" value="C">
                          {problemData.content.answerC}
                        </Radio>
                        <Radio colorScheme="linkedin" value="D">
                          {problemData.content.answerD}
                        </Radio>
                        <Radio colorScheme="linkedin" value="E">
                          {problemData.content.answerE}
                        </Radio>
                      </>
                    )}
                  </Stack>
                </RadioGroup>
              </VStack>
            ) : (
              <Input
                type="text"
                variant="unstyled"
                borderBottom="1px"
                borderRadius="0"
                placeholder="Answer"
                zIndex="2"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxWidth="65ch"
              />
            )}
          </Flex>
        ) : (
          <Flex fontSize="xl" padding="4.5rem">
            No question found
          </Flex>
        )}
        <Flex justifyContent="space-between" p="1em">
          <Flex>
            <Button onClick={toggleFlag}>
              <MdFlag
                color={
                  answerData?.flagStatus === FlagStatus.FLAGGED
                    ? "yellow"
                    : undefined
                }
                size="2em"
              />
              <Text>Flag Question</Text>
            </Button>
          </Flex>
          <Flex gap="1em">
            <Button onClick={prevPage} w="6em">
              <Text>Previous</Text>
            </Button>
            <Button onClick={nextPage} w="6em">
              <Text>Next</Text>
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Flex
        direction="column"
        position="relative"
        height="100%"
        justifyContent="space-between"
        alignItems="center"
        bgImage="/comp-dark.png"
          width="100%"
          h="100%"
          bgRepeat="repeat-y"
          w="30vw"
      >
        <VStack paddingBlock="2rem" spacing={8}>
          <Box padding=".5rem 1rem" borderRadius="1rem" bgColor="#FBEDD199">
            <Heading fontFamily="Arial" fontSize="1.5rem" color="blue">
              Navigation
            </Heading>
          </Box>
          <Grid gridTemplateColumns="repeat(5, 1fr)" gap="1rem">
            {mergedProblemAnswerData.map((problem, index) => (
              <Flex
                bgColor={currentQ === index + 1 ? "gray.500" : "whiteCream"}
                direction="column"
                height="4.5rem"
                width="3.5rem"
                borderRadius=".75rem"
                key={problem.id}
                onClick={() => {
                  jumpToPage(index + 1);
                }}
                cursor="pointer"
                _hover={
                  currentQ === index + 1
                    ? {}
                    : {
                        bgColor: "#DACCC1",
                      }
                }
              >
                <Box
                  height="1.375rem"
                  width="100%"
                  borderRadius=".75rem .75rem 0 0"
                  bgColor={
                    problem.answerData
                      ? problem.answerData.flagStatus === FlagStatus.UNANSWERED
                        ? "white"
                        : problem.answerData.flagStatus === FlagStatus.FLAGGED
                        ? "yellow"
                        : "blue"
                      : "white"
                  }
                />
                <Center
                  fontWeight="semibold"
                  fontSize="1.5rem"
                  fontFamily="Arial"
                  color={currentQ === index + 1 ? "white" : "blue"}
                  flexGrow={1}
                >
                  {index + 1}
                </Center>
              </Flex>
            ))}
          </Grid>
        </VStack>
        <BtnSubmitConsent isRequiredAll={isAnsweredAll} onSubmit={submitExam}/>
        <VStack
          spacing={6}
          bgColor="#FBEDD199"
          paddingBlock="1rem"
          width="100%"
        >
          <Heading fontFamily="Arial" color="blue" fontSize="2rem">
            Time Remaining
          </Heading>
          <Heading fontFamily="Arial" fontSize="2rem" color="blue">
            {intToTime(remainingTime) ?? "--:--"}
          </Heading>
        </VStack>
        <Box
          
        />
      </Flex>
    </Flex>
  );
};

const intToTime = (time: number) => {
  time /= 1000;
  if (time < 0) return "--:--:--";

  return moment().startOf("day").seconds(time).format("HH:mm:ss");

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return `${hours}:${minutes}:${seconds}`;
};
