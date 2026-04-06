import type { BaseApiResponse } from "@/types/baseApi.types";
import type { UploadMeta, UploadResult } from "@/types/uploader.types";
import { TokenUtil } from "@/utils/tokenUtil";
import axios from "axios";
import { useCallback, useState } from "react";

interface UseFileUploadResult {
  uploadFile: (file: File, meta: UploadMeta) => Promise<UploadResult>;
  progress: number;
  resetProgress: () => void;
}

const UPLOAD_URL = import.meta.env.VITE_SERVER_URL + "/common/media/upload";

export function useFileUpload(): UseFileUploadResult {
  const [progress, setProgress] = useState<number>(0);

  const uploadFile = useCallback(
    async (file: File, meta: UploadMeta): Promise<UploadResult> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", meta.type);
      formData.append("uploader", meta.uploader);
      formData.append("group", meta.group);
      formData.append("size", meta.size);

      const response = await axios.post<BaseApiResponse<UploadResult>>(
        UPLOAD_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${TokenUtil.getToken()}`,
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setProgress(Math.round((event.loaded * 100) / event.total));
            }
          },
        },
      );

      return response.data.data;
    },
    [],
  );

  const resetProgress = () => setProgress(0);

  return { uploadFile, progress, resetProgress };
}
