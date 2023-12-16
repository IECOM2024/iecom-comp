import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  calc,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SimulAttemptPhase } from "@prisma/client";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { MdLock } from "react-icons/md";
import { FileInput } from "~/components/common/CustomForm/FileInput";
import { Loading } from "~/components/common/Loading";
import { RouterOutputs, api } from "~/utils/api";
import { AllowableFileTypeEnum, FolderEnum } from "~/utils/file";
import { useUploader } from "~/utils/hooks/useUploader";
import htmlParser from "react-html-parser";
import moment, { duration } from "moment";
import { get } from "lodash";

interface SimulExamProps {
  examId: string;
}

export const SimulExam = ({ examId }: SimulExamProps) => {
  const toast = useToast();
  const router = useRouter();
  const { uploader } = useUploader();

  const simulInfoQuery = api.simul.site.getSimulInfo.useQuery({
    examId,
  });

  const saveSimulAnswerMutation = api.simul.site.saveSimulAnswer.useMutation();
  const submitSimulAnswerMuation =
    api.simul.site.submitSimulAnswer.useMutation();
  const endSimulMutation = api.simul.site.endSimul.useMutation();

  const simulInfoData = simulInfoQuery.data;

  const [currentNumber, setCurrentNumber] = useState(-1);

  const { mutateAsync: getSimulProblemDataAsync } =
    api.simul.site.getSimulProblemDataImperative.useMutation();

  const getSimulProblemData = async (data: {
    simulInfoId: string;
    qNumber: number;
  }) => {
    return await getSimulProblemDataAsync(data).then((res) => {
      simulInfoQuery.refetch();
      return res;
    });
  };

  const endQuestion = async () => {
    toast({
      title: "Question Ended",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    simulInfoQuery.refetch();
  };

  const uploadAnswerFile = async (data: {
    simulAttemptId: string;
    qNumber: number;
    file: File;
    file2: File;
    simulProblemId: string;
  }) => {
    await uploader(
      `${data.simulAttemptId}_${data.qNumber + 1}_answer.pdf`,
      FolderEnum.SIMUL_COMP_FILES,
      AllowableFileTypeEnum.PDF,
      data.file
    );
    await uploader(
      `${data.simulAttemptId}_${data.qNumber + 1}_extra.${data.file2.name
        .split(".")
        .pop()}`,
      FolderEnum.SIMUL_COMP_FILES,
      AllowableFileTypeEnum.ZIP,
      data.file2
    );
    await saveSimulAnswerMutation
      .mutateAsync({
        simulAttemptId: data.simulAttemptId,
        simulProblemId: data.simulProblemId,
        fileUploadLink: `https://storage.googleapis.com/public-yekomvinlines/simul-comp-files/${
          data.simulAttemptId
        }_${data.qNumber + 1}.pdf`,
        fileUploadLink2: `https://storage.googleapis.com/public-yekomvinlines/simul-comp-files/${
          data.simulAttemptId
        }_${data.qNumber + 1}_extra.${data.file2.name.split(".").pop()}`,
      })
      .then(() => {
        toast({
          title: "Success",
          description: "Your file has been uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        simulInfoQuery.refetch();
      });
  };

  
  if (!simulInfoData) {
    return <Loading />;
  }

  const endSimul = async () => {
    await endSimulMutation.mutateAsync({
      simulInfoId: simulInfoData.simulInfo.id,
    });
    router.push(`/exam/${examId}`);
  }


  return (
    <Flex flexDir="column" p="3em">
      <Flex flexWrap="wrap" gap="5em" justifyContent="space-around">
        {simulInfoData.simulQuestions.map((simulQuestion, index) => (
          <SimulProblemModal
            simulQuestion={simulQuestion}
            simulInfo={simulInfoData.simulInfo}
            simulAttempt={simulInfoData.simulAttempt}
            key={index}
            getSimulProblemData={getSimulProblemData}
            uploadAnswerFile={uploadAnswerFile}
            durationRemaining={simulInfoData.remainingDuration ?? 0}
            endQuestion={endQuestion}
          />
        ))}
      </Flex>
      {
        simulInfoData.simulAttempt.currentNumber >= simulInfoData.simulInfo.noOfQuestions && (
          <Button
            mt="2em"
            onClick={endSimul}
            w="min(20em, 90%)"
            mx="auto"
          >
            End Exam
          </Button>
        )
      }
    </Flex>
  );
};

interface SimulQuestionModalProps {
  simulQuestion: RouterOutputs["simul"]["site"]["getSimulInfo"]["simulQuestions"][0];
  simulInfo: RouterOutputs["simul"]["site"]["getSimulInfo"]["simulInfo"];
  simulAttempt: RouterOutputs["simul"]["site"]["getSimulInfo"]["simulAttempt"];
  getSimulProblemData: (data: {
    qNumber: number;
    simulInfoId: string;
  }) => Promise<
    RouterOutputs["simul"]["site"]["getSimulProblemDataImperative"]
  >;
  uploadAnswerFile: (data: {
    simulAttemptId: string;
    qNumber: number;
    file: File;
    file2: File;
    simulProblemId: string;
  }) => Promise<void>;
  durationRemaining: number;
  endQuestion: () => Promise<void>;
}

const SimulProblemModal = ({
  simulQuestion,
  simulInfo,
  simulAttempt,
  getSimulProblemData,
  uploadAnswerFile,
  durationRemaining,
  endQuestion,
}: SimulQuestionModalProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const fileStateArr = useState<File | null | undefined>(null);
  const fileStateArr2 = useState<File | null | undefined>(null);

  const [remainingDuration, setRemainingDuration] = useState(-1);

  const [simulAnswer, setSimulAnswer] = useState<
    | RouterOutputs["simul"]["site"]["getSimulProblemDataImperative"]
    | null
    | undefined
  >(null);

  const [isLapsed, setIsLapsed] = useState(false);

  const timeCalculator = useCallback(() => {
    const calculatedDuration = -moment().diff(simulAttempt.dueDate, "ms");
    setRemainingDuration(calculatedDuration);
  }, [simulAttempt.dueDate]);

  useEffect(() => {
    if (remainingDuration >= 0.2 && isLapsed) {
      setTimeout(() => {
        timeCalculator();
      }, 1000);
    }
  }, [isLapsed, remainingDuration, timeCalculator]);

  useEffect(() => {
    if (
      simulAttempt.phase === SimulAttemptPhase.ATTEMPTING ||
      simulAttempt.phase === SimulAttemptPhase.REDO_ATTEMPTING
    ) {
      timeCalculator()
      setTimeout(() => {
        setIsLapsed(true);
      }, 150);
    }
  }, [simulAttempt.phase, timeCalculator]);

  useEffect(() => {
    if (remainingDuration < 0.2 && isLapsed) {
      console.log("called");
      if (fileStateArr[0]) {
        uploadAnswerFile({
          simulAttemptId: simulAttempt.id,
          qNumber: simulQuestion.pNumber,
          file: fileStateArr[0]!,
          file2: fileStateArr2[0]!,
          simulProblemId: simulQuestion.id,
        });
      }
      setIsLapsed(false);
      onClose();
      endQuestion();
    }
  }, [
    endQuestion,
    setIsLapsed,
    isLapsed,
    fileStateArr,
    fileStateArr2,
    onClose,
    simulAttempt.id,
    simulQuestion,
    uploadAnswerFile,
    remainingDuration,
    simulAnswer,
    simulInfo,
  ]);

  const handleGetSimulProblemData = () => {
    getSimulProblemData({
      simulInfoId: simulInfo.id,
      qNumber: simulQuestion.pNumber,
    }).then((res) => {
      if (res) {
        setSimulAnswer(res);
      }
    });
  };

  return (
    <>
      <Flex
        flexDir="column"
        w="min(90%,20em)"
        mx="auto"
        borderRadius=".75rem"
        bg="whiteCream"
        pb="2em"
        transition="all .2s ease-in-out"
        _hover={
          simulQuestion.pNumber === simulAttempt.currentNumber
            ? {
                transform: "scale(1.05)",
                cursor: "pointer",
              }
            : undefined
        }
        overflow="hidden"
        position="relative"
        onClick={
          simulQuestion.pNumber === simulAttempt.currentNumber
            ? onOpen
            : undefined
        }
      >
        {simulQuestion.pNumber > simulAttempt.currentNumber && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bgColor="rgba(0,0,0,.5)"
            zIndex="1"
            alignItems="center"
            justifyContent="center"
          >
            <MdLock size="3rem" color="white" />
          </Flex>
        )}
        <Box
          height="3rem"
          width="100%"
          borderRadius=".75rem .75rem 0 0"
          bgColor={
            simulQuestion.pNumber < simulAttempt.currentNumber
              ? "blue"
              : "white"
          }
          textAlign="center"
          fontSize="2rem"
          color={
            simulQuestion.pNumber < simulAttempt.currentNumber
              ? "white"
              : "black"
          }
        >
          {simulQuestion.pNumber < simulAttempt.currentNumber
            ? "Completed"
            : calculateMinFromMilisec(simulQuestion.problemDuration)}
        </Box>
        <Text
          w="100%"
          fontSize="2rem"
          textAlign="center"
          fontWeight="bold"
          color="blue"
        >
          #{simulQuestion.pNumber + 1}
        </Text>
        <Text
          w="100%"
          fontSize="1.5rem"
          textAlign="center"
          fontWeight="bold"
          color="blue"
        >
          {simulQuestion.problemTitle}
        </Text>
      </Flex>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent maxW="min(45em,95%)">
          <ModalCloseButton />
          <ModalHeader>
            <Text fontSize="1em" fontWeight="bold" color="blue">
              {`#${simulQuestion.pNumber + 1}  ${simulQuestion.problemTitle}`}
            </Text>
          </ModalHeader>
          <ModalBody p="1.5em">
            {simulAttempt.phase === SimulAttemptPhase.IDLE ||
            simulAttempt.phase === SimulAttemptPhase.REDO_IDLE ? (
              <Flex flexDir="column">
                <Text>Please click the button below to start the attempt</Text>
                <Button mt="1em" onClick={handleGetSimulProblemData}>
                  Start Attempt
                </Button>
              </Flex>
            ) : (
              <Flex flexDir="column">
                <Text>{htmlParser(simulQuestion.problemDesc)}</Text>
                <Text
                  mt="1em"
                  fontSize="2em"
                  fontWeight="bold"
                  color="blue"
                  textAlign="center"
                >
                  Time Remaining
                </Text>
                <Text
                  mt="1em"
                  fontSize="1.5em"
                  fontWeight="bold"
                  color="blue"
                  textAlign="center"
                >
                  {intToTime(remainingDuration)}
                </Text>
                <Text mt="1em" fontSize="1em" color="blue" textAlign="center">
                  Upload your answer file below in a pdf format
                </Text>
                <Flex mx="auto" mt="2em">
                  <FileInput
                    fileStateArr={fileStateArr}
                    imgUrl={
                      simulAnswer?.simulAnswer.fileUploadLink ?? undefined
                    }
                    allowed={[AllowableFileTypeEnum.PDF]}
                  />
                </Flex>

                <Text mt="1em" fontSize="1em" color="blue" textAlign="center">
                  Upload your calculation file below on any format, if there is
                  more than one file, please zip it first
                </Text>

                <Flex mx="auto" mt="2em">
                  <FileInput
                    fileStateArr={fileStateArr2}
                    imgUrl={
                      simulAnswer?.simulAnswer.fileUploadLink ?? undefined
                    }
                    allowed={[AllowableFileTypeEnum.PDF]}
                  />
                </Flex>

                {fileStateArr[0] && (
                  <Button
                    mt="2em"
                    onClick={() => {
                      uploadAnswerFile({
                        simulAttemptId: simulAttempt.id,
                        qNumber: simulQuestion.pNumber,
                        file: fileStateArr[0]!,
                        file2: fileStateArr2[0]!,
                        simulProblemId: simulQuestion.id,
                      });
                    }}
                  >
                    Upload
                  </Button>
                )}
                {simulAnswer?.simulAnswer.fileUploadLink && (
                  <Button
                    color="salmon"
                    mt="1em"
                    onClick={() => {
                      endQuestion().then(onClose);
                    }}
                  >
                    End Question
                  </Button>
                )}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const calculateMinFromMilisec = (milisec: number) => {
  const min = Math.floor(milisec / 60000);
  const sec = Math.floor((milisec % 60000) / 1000);
  return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
};

const intToTime = (time: number) => {
  time /= 1000;
  if (time < 0) return "--:--:--";

  return moment().startOf("day").seconds(time).format("HH:mm:ss");
};
