import api from "./api";
import { setSecureItem, removeSecureItem, getSecureItem } from "@/lib/storage";
import { useAuthStore } from "@/stores/use-auth-store";
import { useTenantStore } from "@/stores/use-tenant-store";
import type { User, Tenant, ApiError, ApiResponse } from "@/types";
import type { InviteRegistrationResult, InviteVerification } from "@/types";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  tenant?: Tenant;
}

interface AuthMessageResponse {
  message: string;
}

export async function login(email: string, password: string): Promise<User> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
    email,
    password,
  });
  const { accessToken, refreshToken, user, tenant } = response.data.data;
  await saveTokens(accessToken, refreshToken);
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
  if (tenant) {
    useTenantStore.getState().setTenant(tenant);
  }
  return user;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<User> {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/register",
    data,
  );
  const { accessToken, refreshToken, user } = response.data.data;
  await saveTokens(accessToken, refreshToken);
  useAuthStore.getState().setAuth(user, accessToken, refreshToken);
  return user;
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getSecureItem("mt:refresh-token");
  if (!refreshToken) throw new Error("No refresh token");

  const response = await api.post<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh",
    { refreshToken },
  );
  const { accessToken } = response.data.data;
  await setSecureItem("mt:auth-token", accessToken);
  useAuthStore.getState().setAccessToken(accessToken);
  return accessToken;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore errors on logout
  }
  await clearTokens();
  useAuthStore.getState().clearAuth();
}

export async function requestPasswordReset(email: string): Promise<string> {
  await api.post<ApiResponse<AuthMessageResponse>>(
    "/auth/forgot-password",
    { email },
  );
  return "Te enviamos un enlace de recuperacion.";
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<string> {
  await api.post<ApiResponse<AuthMessageResponse>>(
    "/auth/reset-password",
    { token, password },
  );
  return "Contrasena actualizada correctamente.";
}

export async function verifyInvite(token: string): Promise<InviteVerification> {
  const response = await api.get<ApiResponse<InviteVerification>>(
    `/auth/verify-invite/${encodeURIComponent(token)}`,
  );
  return response.data.data;
}

export async function registerInvite(data: {
  token: string;
  name?: string;
  password?: string;
}): Promise<InviteRegistrationResult> {
  const response = await api.post<ApiResponse<InviteRegistrationResult>>(
    "/auth/register-invite",
    data,
  );
  return response.data.data;
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as Partial<ApiError>;

  switch (apiError.code) {
    case "PASSWORD_RESET_EMAIL_NOT_FOUND":
      return "No encontramos una cuenta con ese correo.";
    case "INVALID_RESET_TOKEN":
      return "El enlace no es valido. Solicita uno nuevo.";
    case "EXPIRED_RESET_TOKEN":
      return "El enlace expiro. Solicita uno nuevo.";
    case "PASSWORD_RESET_EMAIL_DELIVERY_FAILED":
      return "No pudimos enviar el correo de recuperacion. Intenta de nuevo mas tarde.";
    case "INVALID_INVITE_TOKEN":
      return "La invitacion no es valida. Solicita una nueva.";
    case "EXPIRED_INVITE_TOKEN":
      return "La invitacion expiro. Solicita una nueva.";
    case "INVITE_REGISTRATION_DETAILS_REQUIRED":
      return "Completa tu nombre y contrasena para aceptar la invitacion.";
    case "INVITED_USER_INACTIVE":
      return "Esta cuenta esta inactiva. Contacta al administrador de la tienda.";
    case "MEMBER_EXISTS":
      return "Esta cuenta ya pertenece a la tienda.";
    default:
      return fallback;
  }
}

async function saveTokens(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await setSecureItem("mt:auth-token", accessToken);
  await setSecureItem("mt:refresh-token", refreshToken);
}

async function clearTokens(): Promise<void> {
  await removeSecureItem("mt:auth-token");
  await removeSecureItem("mt:refresh-token");
}
