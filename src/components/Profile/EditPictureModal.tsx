import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Box,
  Input,
  Image,
  ModalFooter,
} from "@chakra-ui/react";
import { MdPerson } from "react-icons/md";
import { useState } from "react";
import { RouterOutputs, api } from "~/utils/api";
import { AllowableFileTypeEnum, FolderEnum } from "~/utils/file";
import { useUploader } from "~/utils/hooks/useUploader";

type ProfileOutput = RouterOutputs["profile"]["getProfile"];

interface EditPictureModalProps {
  profile: ProfileOutput;
  imageUrl?: string;
  uploadProfileImage: (picInput: File | undefined) => Promise<void>;
  isUploading: boolean;
}

export const EditPictureModal = ({ profile, imageUrl, uploadProfileImage, isUploading  }: EditPictureModalProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const [picInput, setPicInput] = useState<File>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setPicInput(e.target.files[0]);
  };
  
  const handleUpload = () => {
    uploadProfileImage(picInput).then(() => onClose())
  }

  return (
    <>
      <Button w="8em" h="8em" borderRadius="4em" mt="1em" onClick={onOpen} overflow="hidden">
        {imageUrl ? <Image src={imageUrl} w="8em"/> : <MdPerson size="8em" />}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Picture</ModalHeader>
          <Box
            w="8em"
            h="8em"
            borderRadius="4em"
            mt="1em"
            onClick={onOpen}
            overflow="hidden"
          >
            {picInput ? (
              <Image src={URL.createObjectURL(picInput)} w="8em" h="8em" />
            ) : profile.imageUrl ? (
              <Image src={profile.imageUrl} w="8em" h="8em" />
            ) : (
              <MdPerson size="8em" />
            )}
          </Box>
          <Input type="file" onChange={handleFileChange} />
          {isUploading ? <p>Uploading...</p> : <></>}
          <ModalFooter>
            <Button onClick={handleUpload}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
