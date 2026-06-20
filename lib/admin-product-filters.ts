import type { Product, ProductFilters } from "@/types";

export const CRITICAL_STOCK_FILTER: NonNullable<ProductFilters["stockStatus"]> =
  "low_stock";

type StockProduct = Pick<
  Product,
  "availableStock" | "reservedStock" | "stock" | "stockStatus"
>;

export function isCriticalStockFilter(
  stockStatus?: ProductFilters["stockStatus"],
) {
  return stockStatus === CRITICAL_STOCK_FILTER;
}

export function getAvailableStock(product: StockProduct) {
  if (typeof product.availableStock === "number") {
    return product.availableStock;
  }

  return Math.max(0, product.stock - (product.reservedStock ?? 0));
}

export function isCriticalStockProduct(product: StockProduct, threshold = 5) {
  return (
    product.stockStatus === "low_stock" ||
    product.stockStatus === "out_of_stock" ||
    getAvailableStock(product) <= threshold
  );
}

export function filterAdminProductsByStockStatus(
  products: Product[],
  stockStatus?: ProductFilters["stockStatus"],
) {
  if (isCriticalStockFilter(stockStatus)) {
    return products.filter((product) => isCriticalStockProduct(product));
  }

  if (stockStatus) {
    return products.filter((product) => product.stockStatus === stockStatus);
  }

  return products;
}
