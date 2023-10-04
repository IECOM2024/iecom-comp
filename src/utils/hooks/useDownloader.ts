import { api } from "../api";

export const useDownloader = () => {
    const generateURLforDownload = api.storage.generateURLForDownload.useMutation();

    return {downloader: generateURLforDownload.mutateAsync}
}