import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { AllowableFileTypeEnum, downloadFile } from "~/utils/file";

export interface FileInputProps {
  fileStateArr: [
    File | null | undefined,
    React.Dispatch<React.SetStateAction<File | null | undefined>>
  ];
  imgUrl?: string;
  allowed?: AllowableFileTypeEnum[];
}

export const FileInput = ({
  fileStateArr,
  imgUrl,
  allowed,
  ...rest
}: FileInputProps) => {
  const [fileState, setFileState] = fileStateArr;

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileState(e.target.files[0]);
    }
  };

  const downloadTheFile = () => {
    if (document && imgUrl) {
      const x = document.createElement("a");
      x.href = imgUrl;
      x.download = imgUrl;
      x.click();
    }
  };

  return (
    <label style={{ cursor: "pointer" }}>
      <Input
        {...rest}
        type="file"
        onChange={fileChangeHandler}
        color={fileState ? "blue" : "transparent"}
        h="4em"
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={
          fileState ? "file-input-default-file-exists" : "file-input-default"
        }
        cursor="pointer"
        accept={allowed ? allowed.join(",") : `${AllowableFileTypeEnum.PICTURES} , ${AllowableFileTypeEnum.ZIP}`} // TODO : Kasih input props untuk menerima file type apa aja
      />
      {imgUrl && (
        <>
          <Text color="blue" w="100%" textAlign="center" mt="1em">
            You have uploaded a file
          </Text>
          <Button onClick={downloadTheFile} variant="mono-outline" w="100%">
            Download My File
          </Button>
        </>
      )}
    </label>
  );
};
