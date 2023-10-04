import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, FormEvent } from "react";
import { RouterInputs } from "~/utils/api";

export type UpdateProfileDataType = RouterInputs["profile"]["updateProfile"];

export interface EditProfileModalProps {
  updateProfile: (data: UpdateProfileDataType, fn: () => void) => void;
  initState: UpdateProfileDataType;
}

export const EditProfileModal = ({
  updateProfile,
  initState,
}: EditProfileModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [nameInput, setNameInput] = useState(initState.name);
  const [emailInput, setEmailInput] = useState(initState.email);

  const { isOpen: isChangingPassword, onOpen: onChangingPassword } =
    useDisclosure();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(
      {
        name: nameInput,
        email: emailInput,
      },
      () => onClose()
    );
  };

  return (
    <>
      <Button onClick={onOpen}>Edit Profile</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <TableContainer>
                <Table>
                  {profileInfoRow("Name ", nameInput, setNameInput)}
                  {profileInfoRow("Email ", emailInput, setEmailInput)}
                </Table>
              </TableContainer>
              <Flex justifyContent="right" w="100%">
                <Button type="submit">Save</Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const profileInfoRow = (
  placeholder: string,
  inputState: any,
  setInputState: React.SetStateAction<typeof inputState>
) => {
  return (
    <Tr h="4em">
      <Td w="40%">
        <Text w="100%">{placeholder}</Text>
      </Td>
      <Td w="40%">
        <Input
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
          w="100%"
        />
      </Td>
    </Tr>
  );
};
