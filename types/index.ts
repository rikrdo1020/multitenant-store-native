export interface User {
  documentId: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "manager" | "customer";
  phone?: string;
}

export type TeamRole = "admin" | "manager";

export type PaymentProviderType = "yappy" | "cash";

export interface PaymentMethod {
  id: PaymentProviderType;
  label: string;
  description: string;
}

export interface CreatePaymentResult {
  success: boolean;
  transactionId?: string;
  documentName?: string;
  token?: string;
}

export interface Tenant {
  documentId: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  primaryColor?: string;
  currency?: string;
  provider?: string;
}

export interface TenantSettings {
  documentId: string;
  currency: string;
  taxRate: number;
  lowStockThreshold: number;
  emailFrom?: string;
  emailFromName?: string;
}

export interface UpdateTenantPayload {
  name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
}

export interface UpdateSettingsPayload {
  currency?: string;
  taxRate?: number;
  lowStockThreshold?: number;
  emailFrom?: string;
  emailFromName?: string;
}

export interface TenantMember {
  documentId: string;
  role: TeamRole | "superadmin";
  createdAt?: string;
  user: {
    documentId: string;
    email: string;
    name?: string | null;
    isActive?: boolean;
  };
}

export interface MemberInvitation {
  documentId: string;
  email: string;
  role: TeamRole;
  tenantId: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt?: string;
}

export interface InviteVerification {
  email: string;
  role: TeamRole;
  isExistingUser: boolean;
  expiresAt: string;
  tenant: Tenant;
}

export interface InviteRegistrationResult {
  message: string;
  existingUser: boolean;
  user: Pick<User, "documentId" | "email" | "name" | "role">;
  tenant: Pick<Tenant, "documentId" | "slug" | "name">;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface Product {
  documentId: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  description?: ProductDescription;
  category?: Category;
  brand?: Brand;
  tags?: Tag[];
  options?: ProductOption[] | Record<string, unknown>;
  type?: string;
  isFeatured?: boolean;
  featuredOrder?: number;
  dku?: string;
  productStatus?: ProductStatus;
  volume?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductDescription =
  | string
  | {
      type?: string;
      content?: string | ProductDescriptionBlock[];
      text?: string;
      [key: string]: unknown;
    }
  | ProductDescriptionBlock[];

export interface ProductDescriptionBlock {
  type?: string;
  text?: string;
  content?: string | ProductDescriptionBlock[];
  children?: ProductDescriptionBlock[];
  [key: string]: unknown;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Category {
  documentId: string;
  slug: string;
  name: string;
  image?: string;
}

export interface Brand {
  documentId: string;
  slug: string;
  name: string;
  logo?: string;
}

export interface Tag {
  documentId: string;
  slug: string;
  name: string;
}

export interface ProductType {
  documentId: string;
  name: string;
  slug: string;
}

export interface ShippingMethod {
  documentId: string;
  name: string;
  type: "pickup_point" | "delivery_zone" | "third_party";
  basePrice?: number | null;
  requiresDetails?: boolean;
  disclaimer?: string | null;
  logistics?: ShippingLocation[];
}

export interface ShippingLocation {
  documentId: string;
  key: string;
  label: string;
  extraPrice?: number | null;
}

export interface ComboDefinition {
  documentId: string;
  name: string;
  price: number;
  isActive: boolean;
  rules: ComboRule[];
}

export interface ComboRule {
  productType: string;
  quantity: number;
}

// --- Catalog CRUD payloads ---

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export interface CreateBrandPayload {
  name: string;
  logo?: string;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

export interface CreateTagPayload {
  name: string;
}

export type UpdateTagPayload = Partial<CreateTagPayload>;

export interface CreateProductTypePayload {
  name: string;
}

export type UpdateProductTypePayload = Partial<CreateProductTypePayload>;

export interface CreateComboPayload {
  name: string;
  price: number;
  rules: ComboRule[];
  isActive?: boolean;
}

export type UpdateComboPayload = Partial<CreateComboPayload>;

export interface CartItem {
  documentId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  image?: string;
  stock: number;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface ReceiverFormData {
  name: string;
  phone: string;
}

export interface ShippingAddressData {
  address: string;
  reference?: string;
  city: string;
}

export type OrderStatus = "pending" | "paid" | "cancelled" | "failed" | "rejected" | "expired";

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  documentId: string;
  orderId: string;
  orderStatus: OrderStatus;
  items: CreateOrderItemPayload[];
  customerData: CustomerFormData;
  shippingData?: {
    address?: {
      address: string;
      city: string;
      reference?: string;
    };
    method?: {
      documentId: string;
      name: string;
      type: string;
    };
    location?: {
      documentId: string;
      key: string;
      label: string;
    };
  };
  shippingMethod?: ShippingMethod;
  shippingMethodId?: string;
  shippingLocationId?: string;
  shippingCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  total: number;
  createdAt: string;
  updatedAt?: string;
  statusHistory?: OrderStatusHistory[];
}

export interface AdminOrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "name_asc" | "name_desc";
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: { field: string; message: string }[];
}

export interface PricingLine {
  itemKey: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discountApplied: number;
}

export interface PricingResult {
  total: number;
  originalTotal: number;
  savings: number;
  lines: PricingLine[];
}

export interface CreateOrderItemPayload {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
  selectedOptions?: Record<string, string>;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: ProductDescription;
  price: number;
  discountPrice?: number;
  dku: string;
  stock?: number;
  productStatus?: ProductStatus;
  type?: string;
  volume?: string;
  options?: ProductOption[] | Record<string, unknown>;
  images?: string[];
  isFeatured?: boolean;
  featuredOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  categoryId?: string;
  brandId?: string;
  tagIds?: string[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  customerData: CustomerFormData;
  shippingData: Record<string, unknown>;
  shippingMethodId?: string;
  shippingLocationId?: string;
  shippingCost: number;
  paymentMethod: string;
  customerId?: string;
}
