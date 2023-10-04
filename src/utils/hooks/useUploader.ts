import { useState } from "react";
import { AllowableFileTypeEnum, FolderEnum } from "../file";
import { api } from "../api";
import { uploadFile } from "../file";

export const useUploader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const generateURLForUpload = api.storage.generateURLForUpload.useMutation();
    const generateURLForDownload = api.storage.generateURLForDownload.useMutation();

    const uploader = async (filename: string, folder: FolderEnum, fileType: AllowableFileTypeEnum, file: File) => {
        if (!file || !filename || !folder || !fileType) return;
        setIsLoading(true)

        const {url: uploadUrl, sanitizedFilename} = await generateURLForUpload.mutateAsync({
            filename,
            folder,
            contentType: fileType
        });

        await uploadFile(uploadUrl,file,fileType)

        const {url} = await generateURLForDownload.mutateAsync({
            filename: sanitizedFilename,
            folder
        });

        setIsLoading(false)

        return {url, filename: sanitizedFilename}
    }

    return {uploader, isUploading: isLoading}
}
