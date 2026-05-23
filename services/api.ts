import axios from "axios";
import { API_URL } from "@/lib/constants";
import { getSecureItem, setSecureItem } from "@/lib/storage";
import { useAuthStore } from "@/stores/use-auth-store";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { ApiError } from "@/types";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  let token: string | null = null;
  try {
    token = await getSecureItem("mt_auth_token");
  } catch {
    // SecureStore unavailable (e.g. emulator keystore not initialized)
  }
  const tenant = useTenantStore.getState().tenant;
  const headers = config.headers as RequestHeaders;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (tenant && !hasRequestHeader(headers, "x-tenant-id")) {
    headers["x-tenant-id"] = tenant.slug;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getSecureItem("mt_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        await Promise.all([
          setSecureItem("mt_auth_token", accessToken),
          setSecureItem("mt_refresh_token", newRefreshToken),
        ]);

        const { setAccessToken } = useAuthStore.getState();
        setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status >= 500) {
      // Server error toast will be handled by UI.
    }

    return Promise.reject(normalizeError(error));
  },
);

function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    const body = data.error ?? data;
    const message =
      typeof body.message === "string" ? body.message : "Error desconocido";

    return {
      code: body.code || "UNKNOWN_ERROR",
      message,
      statusCode: error.response.status,
      details: body.details,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Error de red. Verifica tu conexion.",
    statusCode: 0,
  };
}

type RequestHeaders = Record<string, unknown> & {
  get?: (name: string) => unknown;
};

function hasRequestHeader(headers: RequestHeaders | undefined, name: string): boolean {
  if (!headers) return false;

  if (typeof headers.get === "function" && headers.get(name)) {
    return true;
  }

  const normalizedName = name.toLowerCase();
  return Object.keys(headers).some(
    (key) => key.toLowerCase() === normalizedName && Boolean(headers[key]),
  );
}

export default api;
