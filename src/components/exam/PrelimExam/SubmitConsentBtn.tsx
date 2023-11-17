import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

interface BtnSubmitConsentProps {
  onSubmit: () => void;
  isRequiredAll: boolean;
}

export const BtnSubmitConsent = ({
  onSubmit,
  isRequiredAll,
}: BtnSubmitConsentProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const rejectSubmit = () => {
    toast({
      title: "Please answer all questions",
      status: "error",
      duration: 2500,
      isClosable: true,
    });
  }

  return (
    <>
      <Flex
        justifyContent="center"
        alignItems="center"
        padding="0.3em"
        w="100%"
      >
        <Button onClick={isRequiredAll ? onOpen : rejectSubmit} colorScheme="blue" size="lg" width="100%">
          Submit Exam
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Exam</ModalHeader>
          <Text color="blue" fontSize="lg">
            Are you sure you want to submit this exam? (You have answered all
            questions)
          </Text>
          <ModalFooter>
            <Flex gap="1em" flexDir={{ base: "column", lg: "row" }} alignItems="center">
              <Button
                onClick={onSubmit}
                colorScheme="blue"
                w={{ base: "100%", lg: "8em" }}
                color="black"
              >
                Submit
              </Button>
              <Button
                onClick={onClose}
                variant="mono-gray"
                w={{ base: "100%", lg: "8em" }}
              >
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
