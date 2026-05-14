export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || "MultiTenant Store";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const PAYMENT_MOCK = process.env.EXPO_PUBLIC_PAYMENT_MOCK === "true";

export const DEFAULT_CURRENCY = "USD";

export const STORAGE_KEYS = {
  AUTH: "mt:auth",
  TENANT: "mt:active-tenant",
  CART: (tenantId: string) => `mt:cart:${tenantId}`,
  CHECKOUT: (tenantId: string) => `mt:checkout:${tenantId}`,
} as const;
