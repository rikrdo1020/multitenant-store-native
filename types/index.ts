export interface User {
  documentId: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'manager' | 'customer';
  phone?: string;
}

export interface Tenant {
  documentId: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  primaryColor?: string;
  currency?: string;
  provider?: 'yappy';
}

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
}

export interface Tag {
  documentId: string;
  slug: string;
  name: string;
}

export interface ProductType {
  documentId: string;
  name: string;
}

export interface ShippingMethod {
  documentId: string;
  name: string;
  type: 'pickup_point' | 'delivery_zone' | 'third_party';
  cost: number;
  locations?: ShippingLocation[];
}

export interface ShippingLocation {
  documentId: string;
  name: string;
  address?: string;
}

export interface ComboDefinition {
  documentId: string;
  name: string;
  conditions: ComboCondition[];
  discount: number;
  discountType: 'percentage' | 'fixed';
}

export interface ComboCondition {
  productType?: string;
  minQuantity?: number;
}

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
  city?: string;
}

export interface Order {
  documentId: string;
  orderId: string;
  orderStatus: 'pending' | 'paid' | 'failed' | 'cancelled' | 'dispatched';
  items: CartItem[];
  customerData: CustomerFormData;
  shippingMethod: ShippingMethod;
  shippingAddress?: ShippingAddressData;
  total: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
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
  details?: Array<{ field: string; message: string }>;
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

export interface CreateOrderPayload {
  items: CartItem[];
  customerData: CustomerFormData;
  receiverData?: ReceiverFormData;
  shippingAddress?: ShippingAddressData;
  shippingMethodId: string;
  shippingLocationId?: string;
}
