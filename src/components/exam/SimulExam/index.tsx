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
import { useEffect, useState } from "react";
import { MdLock } from "react-icons/md";
import { FileInput } from "~/components/common/CustomForm/FileInput";
import { Loading } from "~/components/common/Loading";
import { RouterOutputs, api } from "~/utils/api";
import { AllowableFileTypeEnum, FolderEnum } from "~/utils/file";
import { useUploader } from "~/utils/hooks/useUploader";
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

  const uploadAnswerFile = async (data: {
    simulAttemptId: string;
    qNumber: number;
    file: File;
    simulProblemId: string;
  }) => {
    uploader(
      `${data.simulAttemptId}_${data.qNumber + 1}.pdf`,
      FolderEnum.SIMUL_COMP_FILES,
      AllowableFileTypeEnum.PDF,
      data.file
    )
      .then((res) =>
        saveSimulAnswerMutation.mutateAsync({
          simulAttemptId: data.simulAttemptId,
          simulProblemId: data.simulProblemId,
          fileUploadLink: `https://storage.googleapis.com/public-yekomvinlines/simul-comp-files/${
            data.simulAttemptId
          }_${data.qNumber + 1}.pdf`,
        })
      )
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
          />
        ))}
      </Flex>
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
    simulProblemId: string;
  }) => Promise<void>;
  durationRemaining: number;
}

const SimulProblemModal = ({
  simulQuestion,
  simulInfo,
  simulAttempt,
  getSimulProblemData,
  uploadAnswerFile,
  durationRemaining,
}: SimulQuestionModalProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const fileStateArr = useState<File | null | undefined>(null);

  const [remainingDuration, setRemainingDuration] = useState(-1);

  const [simulAnswer, setSimulAnswer] = useState<
    | RouterOutputs["simul"]["site"]["getSimulProblemDataImperative"]
    | null
    | undefined
  >(null);

  useEffect(() => {
    if (remainingDuration > 0) {
      setTimeout(() => {
        setRemainingDuration(remainingDuration - 1000);
      }, 1000);
    }
  }, [remainingDuration, setRemainingDuration]);

  useEffect(() => {
    if (
      simulAttempt.phase === SimulAttemptPhase.ATTEMPTING ||
      simulAttempt.phase === SimulAttemptPhase.REDO_ATTEMPTING
    ) {
      setRemainingDuration(durationRemaining);
    }
  }, [simulAttempt.phase, durationRemaining]);

  useEffect(() => {
    if (durationRemaining < 0) {
      if (fileStateArr[0]) {
        uploadAnswerFile({
          simulAttemptId: simulAttempt.id,
          qNumber: simulQuestion.pNumber,
          file: fileStateArr[0]!,
          simulProblemId: simulQuestion.id,
        });
      }
      onClose();
    }
  });

  const handleGetSimulProblemData = () => {
    getSimulProblemData({
      simulInfoId: simulInfo.id,
      qNumber: simulQuestion.pNumber,
    }).then((res) => {
      if (res) {
        setSimulAnswer(res);
        setRemainingDuration(res.simulAttempt.durationRemaining);
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
        <ModalContent w="min(45em,95%)">
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
                <Text>{simulQuestion.problemDesc}</Text>
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
                <Flex mx="auto" mt="2em">
                  <FileInput
                    fileStateArr={fileStateArr}
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
                        simulProblemId: simulQuestion.id,
                      });
                    }}
                  >
                    Upload
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
