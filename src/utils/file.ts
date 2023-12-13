import axios, { type AxiosProgressEvent } from "axios";

export enum FolderEnum {
  PROFILE = "profile-picture",
  DOCUMENT = "document",
  COLOR_RUN_PROOF = "color-run-payment-proof",
  CASE_COMP_FILES = "case-comp-files",
  CASE_COMP_PROOF = "case-comp-proof",
  ESSAY_COMP_FILES = "essay-comp-files",
  ESSAY_COMP_PROOF = "essay-comp-proof",
  ESSAY_COMP_SUBMISSION = "essay-comp-submission",
  SIMUL_COMP_FILES = "simul-comp-files",
}

export enum AllowableFileTypeEnum {
  PDF = "application/pdf",
  PNG = "image/png",
  JPEG = "image/jpeg",
  ZIP = "application/zip",
  PICTURES = "image/*"
}

export const uploadFile = async (
  url: string,
  file: File,
  type: AllowableFileTypeEnum,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const axiosInstance = axios.create();

  await axiosInstance.put<null>(url, file, {
    headers: {
      "Content-Type": type
    },
    onUploadProgress
  });
};

export const downloadFile = async (
  url: string,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const axiosInstance = axios.create();
 
  const response = await axiosInstance.get<Blob>(url, {
    responseType: "blob",
    onDownloadProgress
  });

  console.log(response)


  return response.data;
};
