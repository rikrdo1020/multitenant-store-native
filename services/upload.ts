import { API_URL } from "@/lib/constants";
import { getSecureItem } from "@/lib/storage";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { ApiResponse, UploadResult } from "@/types";

export const uploadService = {
  uploadImage: async (
    fileUri: string,
    folder?: string,
  ): Promise<UploadResult> => {
    const filename = fileUri.split("/").pop() || "image.jpg";
    const blob = await fetch(fileUri).then((r) => r.blob());

    const formData = new FormData();
    formData.append("file", blob, filename);

    const token = await getSecureItem("mt_auth_token");
    const tenant = useTenantStore.getState().tenant;

    const url = new URL(`${API_URL}/upload/image`);
    if (folder) url.searchParams.set("folder", folder);

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (tenant) headers["x-tenant-id"] = tenant.slug;

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: formData,
    });

    const json: ApiResponse<UploadResult> = await response.json();

    if (!response.ok) {
      const err = (json as any).error;
      throw { code: err?.code ?? "UPLOAD_ERROR", message: err?.message ?? "Upload failed", statusCode: response.status };
    }

    return json.data;
  },
};
