import type { Product } from "@/types";
import {
  filterAdminProductsByStockStatus,
  getAvailableStock,
  isCriticalStockProduct,
} from "./admin-product-filters";

const makeProduct = (overrides: Partial<Product>): Product => ({
  documentId: overrides.documentId ?? "product-1",
  name: overrides.name ?? "Product",
  slug: overrides.slug ?? "product",
  price: overrides.price ?? 10,
  stock: overrides.stock ?? 10,
  images: [],
  ...overrides,
});

describe("admin product filters", () => {
  it("GIVEN reserved stock WHEN getting available stock SHOULD subtract reservations", () => {
    const product = makeProduct({ stock: 6, reservedStock: 2 });

    expect(getAvailableStock(product)).toBe(4);
  });

  it("GIVEN out of stock product WHEN checking critical stock SHOULD include it", () => {
    const product = makeProduct({ stock: 0, stockStatus: "out_of_stock" });

    expect(isCriticalStockProduct(product)).toBe(true);
  });

  it("GIVEN low stock filter WHEN filtering products SHOULD include low and out of stock products", () => {
    const products = [
      makeProduct({
        documentId: "in-stock",
        stock: 20,
        stockStatus: "in_stock",
      }),
      makeProduct({
        documentId: "low-stock",
        stock: 4,
        stockStatus: "low_stock",
      }),
      makeProduct({
        documentId: "out-of-stock",
        stock: 0,
        stockStatus: "out_of_stock",
      }),
    ];

    expect(
      filterAdminProductsByStockStatus(products, "low_stock").map(
        (product) => product.documentId,
      ),
    ).toEqual(["low-stock", "out-of-stock"]);
  });
});
