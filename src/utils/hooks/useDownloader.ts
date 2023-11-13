import { api } from "../api";

export const useDownloader = () => {
  const generateURLforDownload =
    api.storage.generateURLForDownload.useMutation();
    function forceDownload(url: string, fileName: string) {
      if (fileName.split(".").pop() === "png") {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      fetch(url).then(res => res.blob()).then(file => {
          const tempUrl = URL.createObjectURL(file);
          const aTag = document.createElement("a");
          aTag.href = tempUrl;
          aTag.download = url.replace(/^.*[\\\/]/, '');
          document.body.appendChild(aTag);
          aTag.click();
          URL.revokeObjectURL(tempUrl);
          aTag.remove();
      }).catch(() => {
          alert("Failed to download file!");
      });
  }

  return {
    downloader: generateURLforDownload.mutateAsync,
    forceDownload: forceDownload,
  };
};

