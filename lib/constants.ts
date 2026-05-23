export const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || "MultiTenant Store";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const PAYMENT_MOCK = process.env.EXPO_PUBLIC_PAYMENT_MOCK === "true";

export const YAPPY_CDN_URL =
  process.env.EXPO_PUBLIC_YAPPY_CDN_URL ??
  "https://bt-cdn.yappy.cloud/v1/cdn/web-component-btn-yappy.js";

export const DEFAULT_CURRENCY = "USD";

export const STORAGE_KEYS = {
  AUTH: "mt_auth",
  TENANT: "mt_active_tenant",
  CART: (tenantId: string) => `mt_cart_${tenantId}`,
  CHECKOUT: (tenantId: string) => `mt_checkout_${tenantId}`,
} as const;
