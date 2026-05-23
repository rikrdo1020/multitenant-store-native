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

export interface CustomerProfile {
  documentId: string;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCustomerProfilePayload {
  name?: string;
  phone?: string;
  notes?: string;
}

export interface CustomerAddress {
  documentId: string;
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerAddressPayload {
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  isDefault?: boolean;
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
  isActive?: boolean;
  logistics?: ShippingLocation[];
}

export interface ShippingLocation {
  documentId: string;
  key: string;
  label: string;
  extraPrice?: number | null;
}

export interface ShippingLocationPayload {
  key: string;
  label: string;
  extraPrice?: number;
}

export interface ShippingMethodPayload {
  name: string;
  type: ShippingMethod["type"];
  basePrice?: number;
  requiresDetails?: boolean;
  disclaimer?: string;
  isActive?: boolean;
  locations?: ShippingLocationPayload[];
}

export interface ShippingCalculation {
  methodId: string;
  locationId: string | null;
  cost: number;
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
  type?: string;
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
  department?: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "failed"
  | "rejected"
  | "expired";

export type OrderDisplayStatus = OrderStatus | "dispatched";

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  documentId: string;
  orderId: string;
  viewToken?: string;
  orderStatus: OrderStatus;
  items: CreateOrderItemPayload[];
  customerData: CustomerFormData;
  shippingData?: {
    address?: {
      address: string;
      city: string;
      department?: string;
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
  confirmationNumber?: string;
  dispatched?: boolean;
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
  updatedAt?: string;
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

export interface Customer {
  id: string;
  documentId: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  createdAt: string;
}

export interface CustomerOrder {
  documentId: string;
  orderId: string;
  orderStatus: OrderStatus;
  total: number;
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  orders: CustomerOrder[];
}

export interface UpdateCustomerPayload {
  name: string;
  email: string;
  phone: string;
}

export interface AdminCustomerFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface MarketplaceFeaturedProduct {
  documentId: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export interface MarketplaceStore {
  documentId: string;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  products: MarketplaceFeaturedProduct[];
}

export interface MarketplaceStoresResult {
  stores: MarketplaceStore[];
  meta: PaginationMeta;
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

// --- Superadmin ---

export type TenantStatus = "active" | "suspended" | "inactive";

export interface SuperadminTenantCount {
  members: number;
  products: number;
  orders: number;
  customers?: number;
}

export interface SuperadminTenantOwner {
  documentId: string;
  email: string;
  name: string | null;
}

export interface SuperadminTenant {
  documentId: string;
  name: string;
  slug: string;
  status: TenantStatus;
  createdAt: string;
  owner: SuperadminTenantOwner;
  _count: SuperadminTenantCount;
  settings?: {
    currency?: string;
    taxRate?: number;
  };
}

export interface SuperadminTenantDetail extends SuperadminTenant {
  _count: SuperadminTenantCount & { customers: number };
}

export interface SuperadminUserTenantRef {
  role: string;
  tenant: { documentId: string; slug: string; name: string };
}

export interface SuperadminUser {
  documentId: string;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: string;
  tenants: SuperadminUserTenantRef[];
}

export interface SuperadminTenantsResult {
  data: SuperadminTenant[];
  meta: PaginationMeta;
}

export interface SuperadminUsersResult {
  data: SuperadminUser[];
  meta: PaginationMeta;
}

export interface SuperadminTenantFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: TenantStatus;
}

export interface SuperadminUserFilters {
  page?: number;
  pageSize?: number;
}

// Analytics
export interface AnalyticsOverview {
  revenue: number;
  orders: number;
  avgTicket: number;
  revenueChange: number;
  ordersChange: number;
  avgTicketChange: number;
}

export interface SalesPoint {
  period: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  imageUrl: string | null;
  units: number;
  revenue: number;
}

export interface CustomerMetrics {
  total: number;
  newCustomers: number;
  returning: number;
  avgTicket: number;
}

export interface AnalyticsQuery {
  from?: string;
  to?: string;
}

export interface SalesQuery extends AnalyticsQuery {
  groupBy?: 'day' | 'week' | 'month';
}

export interface TopProductsQuery extends AnalyticsQuery {
  limit?: number;
}
