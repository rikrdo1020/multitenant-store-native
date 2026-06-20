import { useState, useCallback, useRef, useEffect } from "react";
import { useProducts } from "@/hooks/api/use-products";
import { useCategories } from "@/hooks/api/use-categories";
import { useBrands } from "@/hooks/api/use-brands";
import type { ProductFilters } from "@/types";

const PAGE_SIZE = 20;

interface CatalogInitialFilters {
  category?: string;
  featured?: boolean;
  sort?: ProductFilters["sort"];
}

export function useCatalog(
  tenantSlug?: string,
  initialFilters: CatalogInitialFilters = {},
) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >(initialFilters.category);
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
  const [sort, setSort] = useState<ProductFilters["sort"]>(initialFilters.sort);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [featured, setFeatured] = useState<boolean | undefined>(
    initialFilters.featured,
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    setSelectedCategory(initialFilters.category);
    setFeatured(initialFilters.featured);
    setSort(initialFilters.sort);
  }, [initialFilters.category, initialFilters.featured, initialFilters.sort]);

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(text), 300);
  }, []);

  const handleCategorySelect = useCallback((id: string | undefined) => {
    setSelectedCategory(id);
    setFeatured(undefined);
  }, []);

  const handleApplyFilters = useCallback(
    (filters: {
      sort?: ProductFilters["sort"];
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
    }) => {
      setSort(filters.sort);
      setSelectedBrand(filters.brand);
      setMinPrice(filters.minPrice);
      setMaxPrice(filters.maxPrice);
      setFeatured(undefined);
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory(undefined);
    setSelectedBrand(undefined);
    setSort(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setFeatured(undefined);
  }, []);

  const filters: Omit<ProductFilters, "page"> = {
    category: selectedCategory,
    brand: selectedBrand,
    featured,
    search: debouncedSearch || undefined,
    sort,
    minPrice,
    maxPrice,
    pageSize: PAGE_SIZE,
  };

  const productsQuery = useProducts(filters, tenantSlug);
  const categoriesQuery = useCategories(tenantSlug);
  const brandsQuery = useBrands(tenantSlug);

  return {
    search,
    handleSearchChange,
    selectedCategory,
    handleCategorySelect,
    selectedBrand,
    featured,
    sort,
    minPrice,
    maxPrice,
    handleApplyFilters,
    clearFilters,
    products: productsQuery.data?.pages.flatMap((p) => p.data) ?? [],
    meta: productsQuery.data?.pages.at(-1)?.meta,
    categories: categoriesQuery.data ?? [],
    brands: brandsQuery.data ?? [],
    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    isFetchingNextPage: productsQuery.isFetchingNextPage,
    hasNextPage: productsQuery.hasNextPage,
    fetchNextPage: productsQuery.fetchNextPage,
    isError: productsQuery.isError,
    refetch: productsQuery.refetch,
  };
}
