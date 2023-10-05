import { Input } from "@chakra-ui/react";

interface FileInputProps {
    fileStateArr: [File | null | undefined, React.Dispatch<React.SetStateAction<File | null | undefined>>]
}

export const FileInput = ({ fileStateArr, ...rest }: FileInputProps) => {
    const [fileState, setFileState] = fileStateArr;

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileState(e.target.files[0]);
        }
    };

    return (
        <Input
            {...rest}
            type='file'
            onChange={fileChangeHandler}
            color='white'
            h="4em"
            display="flex"
            alignItems="center"
            justifyContent="center"
            className="file-input-default"
        />
    );
}