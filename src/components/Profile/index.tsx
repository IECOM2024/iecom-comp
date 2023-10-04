import {
  Box,
  Button,
  Flex,
  Input,
  Table,
  TableContainer,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { MdClose, MdEdit, MdPerson } from "react-icons/md";
import { useState, useEffect } from "react";
import { RouterInputs, api } from "~/utils/api";
import { useToaster } from "~/utils/hooks/useToaster";
import { EditProfileModal, UpdateProfileDataType } from "./EditProfileModal";
import { EditPictureModal } from "./EditPictureModal";
import { useDownloader } from "~/utils/hooks/useDownloader";
import { AllowableFileTypeEnum, FolderEnum, downloadFile } from "~/utils/file";
import { useUploader } from "~/utils/hooks/useUploader";

export const Profile = () => {
  const toaster = useToaster();
  const { data: session } = useSession();
  const { downloader } = useDownloader();
  const { uploader, isUploading } = useUploader();

  const profileQuery = api.profile.getProfile.useQuery();
  const profileMutation = api.profile.updateProfile.useMutation();

  const profile = profileQuery.data;

  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!profile) return;
    downloader({
      folder: FolderEnum.PROFILE,
      filename: `${profile.id}.png`,
    }).then(({ url }) => setImageUrl(url));
  }, [profile]);

  console.log(imageUrl);

  if (!profile) return <></>;

  const updateProfile = async (data: UpdateProfileDataType, fn: () => void) => {
    toaster(profileMutation.mutateAsync(data), {
      thenFn: () => {
        fn();
        profileQuery.refetch();
      },
    });
  };

  const uploadProfileImage = async (picInput: File | undefined) => {
    if (!picInput) return;
    uploader(
      `${profile.id}.png`,
      FolderEnum.PROFILE,
      AllowableFileTypeEnum.JPEG,
      picInput
    );
    profileQuery.refetch();
  };

  return (
    <Flex
      border="1px solid black"
      borderRadius="10px"
      w="min(95%,30em)"
      alignItems="center"
      flexDir="column"
      p="1em"
      m="auto"
    >
      <EditPictureModal
        profile={profile}
        imageUrl={imageUrl}
        uploadProfileImage={uploadProfileImage}
        isUploading={isUploading}
      />
      <TableContainer>
        <Table>
          <ProfileInfoRow placeholder="Name" value={profile.name} />
          <ProfileInfoRow placeholder="Email" value={profile.email} />
        </Table>
      </TableContainer>
      {!profileQuery.isLoading && (
        <EditProfileModal
          initState={{
            name: profile.name || "",
            email: profile.email || "",
          }}
          updateProfile={updateProfile}
        />
      )}
    </Flex>
  );
};

interface ProfileInfoRowProps {
  placeholder: string;
  value: any;
}

const ProfileInfoRow = ({ placeholder, value }: ProfileInfoRowProps) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Tr h="4em">
      <Td w="40%">
        <Text w="100%">{placeholder}</Text>
      </Td>
      <Td w="40%">
        <Text noOfLines={1} w="100%">
          {value}
        </Text>
      </Td>
    </Tr>
  );
};
