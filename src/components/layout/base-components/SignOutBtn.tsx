import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";

export const SignOutBtn = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} mt="1em">
        Sign Out
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p="1em">
          <ModalHeader>Sign Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="xl">Are you sure you want to sign out?</Text>
          </ModalBody>
          <Flex
            flexDir={{ base: "column", md: "row" }}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            gap="1em"
          >
            <Button onClick={() => signOut()} color="salmon" border="1px solid salmon" fontWeight="bold">Sign Out</Button>
            <Button onClick={onClose}>Cancel</Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};
