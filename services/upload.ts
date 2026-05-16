import api from "./api";
import type { ApiResponse, UploadResult } from "@/types";

export const uploadService = {
  uploadImage: async (
    fileUri: string,
    folder?: string,
  ): Promise<UploadResult> => {
    const formData = new FormData();
    const filename = fileUri.split("/").pop() || "image.jpg";
    const match = /\.([a-zA-Z]+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: fileUri,
      name: filename,
      type,
    } as unknown as Blob);

    const response = await api.post<ApiResponse<UploadResult>>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: folder ? { folder } : undefined,
      },
    );
    return response.data.data;
  },
};
