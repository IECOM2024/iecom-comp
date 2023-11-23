import {
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ColorRunParticipantData,
  ExamAttendanceStatus,
  RegistrationStatus,
} from "@prisma/client";
import { MdEdit, MdMessage } from "react-icons/md";
import { useDownloader } from "~/utils/hooks/useDownloader";
import { FolderEnum } from "~/utils/file";
import { useEffect, useState } from "react";
import { RouterOutputs } from "~/utils/api";

interface ObjectListRowProps {
  objectContent: RouterOutputs["exam"]["admin"]["getAllAttendanceByExamId"]["data"][0];
  num: number;
  updateStatus: (id: string, status: ExamAttendanceStatus) => void;
  deleteAttendance: (id: string) => void;
}

export const ExamAttendanceRow = ({
  objectContent,
  num,
  updateStatus,
  deleteAttendance
}: ObjectListRowProps) => {
  const toast = useToast();

  const [status, setStatus] = useState<ExamAttendanceStatus>(
    objectContent.status
  );

  const [durationRemaining, setDurationRemaining] = useState(0);

  useEffect(() => {
    if (objectContent.durationRemaining) {
      setDurationRemaining(objectContent.durationRemaining);
      setInterval(() => {
        setDurationRemaining(durationRemaining - 1);
      }, 1000);
    }
  },[durationRemaining, setDurationRemaining, objectContent.durationRemaining])

  const [msgInput, setMsgInput] = useState("");
  const msgInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgInput(e.target.value);
  };

  const registData = objectContent.user.MainCompetitionRegistrationData[0];

  const onChangeStatus = (status: ExamAttendanceStatus) => () => {
    updateStatus(objectContent.id, status)
  }

  return (
    <Tr>
      <Td>{num}</Td>
      <Td>{objectContent.user.name}</Td>
      <Td>{objectContent.user.email}</Td>
      <Td>{objectContent.durationRemaining}</Td>
      <Td>
        TO DO
      </Td>
      <Td>
        <Menu>
          <MenuButton
            bg="none"
            border={
              status === ExamAttendanceStatus.ABSENT
                ? "1.5px solid blue"
                : status === ExamAttendanceStatus.TAKEN
                ? "1.5px solid black"
                : status === ExamAttendanceStatus.PAUSED
                ? "1.5px solid yellow"
                : status === ExamAttendanceStatus.FINISHED
                ? "1.5px solid green"
                : undefined
            }
            p="0.5em"
          >
            {status}
          </MenuButton>
          <MenuList as={Flex} flexDir="column" gap="1em" p="1em">
            <Button
              bg="gray"
              color="white"
              onClick={onChangeStatus(ExamAttendanceStatus.TAKEN)}
            >
              TAKEN
            </Button>
            <Button
              bg="green.100"
              onClick={onChangeStatus(ExamAttendanceStatus.PAUSED)}
            >
              PAUSED
            </Button>
          </MenuList>
        </Menu>
      </Td>
      <Td>
        RESET 
      </Td>
    </Tr>
  );
};
