import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as z from 'zod';
import { useBrands } from '@/hooks/api/use-brands';
import { useCategories } from '@/hooks/api/use-categories';
import { useCreateProduct } from '@/hooks/api/use-create-product';
import { useProduct } from '@/hooks/api/use-product';
import { useProductTypes } from '@/hooks/api/use-product-types';
import { useTags } from '@/hooks/api/use-tags';
import { useUpdateProduct } from '@/hooks/api/use-update-product';
import { useUploadImage } from '@/hooks/api/use-upload-image';
import { generateDKU, sanitizeDecimalInput, sanitizeIntegerInput, slugify } from '@/lib/utils';
import type { Product, ProductOption } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'El precio debe ser mayor a 0'),
  discountPrice: z.coerce.number().optional(),
  dku: z.string().min(1, 'El DKU es requerido'),
  stock: z.coerce.number().min(0).optional(),
  productStatus: z.enum(['draft', 'published', 'archived']).default('draft'),
  type: z.string().optional(),
  volume: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  featuredOrder: z.coerce.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const defaultProductValues: ProductFormValues = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  discountPrice: undefined,
  dku: '',
  stock: 0,
  productStatus: 'draft',
  type: '',
  volume: '',
  categoryId: '',
  brandId: '',
  tagIds: [],
  images: [],
  isFeatured: false,
  featuredOrder: 9999,
  seoTitle: '',
  seoDescription: '',
};

export function useAdminProductEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';
  const productQuery = useProduct(undefined, isNew ? undefined : id);
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();
  const tagsQuery = useTags();
  const productTypesQuery = useProductTypes();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadImage();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const nameValue = form.watch('name');

  useEffect(() => {
    if (isNew) {
      form.reset(defaultProductValues);
      setOptions([]);
      return;
    }

    if (productQuery.data) {
      form.reset(mapProductToForm(productQuery.data));
      setOptions(readProductOptions(productQuery.data.options));
    }
  }, [form, isNew, productQuery.data]);

  useEffect(() => {
    if (isNew && nameValue) {
      form.setValue('slug', slugify(nameValue), { shouldValidate: true });
    }
  }, [form, isNew, nameValue]);

  useEffect(() => {
    if (isNew && nameValue && !form.getValues('dku')) {
      form.setValue('dku', generateDKU(nameValue), { shouldValidate: true });
    }
  }, [form, isNew, nameValue]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;

    setUploadingIndex(0);
    uploadImage.mutate(
      { fileUri: result.assets[0].uri, folder: 'products' },
      {
        onSettled: () => setUploadingIndex(null),
        onSuccess: (data) => {
          form.setValue('images', [...form.getValues('images'), data.url], { shouldValidate: true });
        },
      },
    );
  };

  const saveProduct = (values: ProductFormValues) => {
    const payload = {
      ...values,
      description: values.description ? { html: values.description } : undefined,
      discountPrice: values.discountPrice || undefined,
      options: options.length > 0 ? options : undefined,
    };

    if (isNew) {
      createProduct.mutate(payload, { onSuccess: () => router.replace('/(admin)/products') });
      return;
    }

    updateProduct.mutate(
      { id: productQuery.data!.documentId, payload },
      { onSuccess: () => router.back() },
    );
  };

  return {
    brandOptions: brandsQuery.data?.map((brand) => ({ label: brand.name, value: brand.documentId })) ?? [],
    categoryOptions: categoriesQuery.data?.map((category) => ({ label: category.name, value: category.documentId })) ?? [],
    control: form.control,
    errors: form.formState.errors,
    goBack: router.back,
    isLoading: !isNew && productQuery.isLoading,
    isNew,
    isSubmitting: createProduct.isPending || updateProduct.isPending,
    options,
    pickImage,
    productTypeOptions: productTypesQuery.data?.map((type) => ({ label: type.name, value: type.name })) ?? [],
    sanitizeDecimalInput,
    sanitizeIntegerInput,
    setOptions,
    submit: form.handleSubmit(saveProduct),
    tagOptions: tagsQuery.data?.map((tag) => ({ label: tag.name, value: tag.documentId })) ?? [],
    uploadingIndex,
  };
}

export type AdminProductEditViewModel = ReturnType<typeof useAdminProductEditScreen>;

function mapProductToForm(product: Product): ProductFormValues {
  return {
    ...defaultProductValues,
    brandId: product.brand?.documentId ?? '',
    categoryId: product.category?.documentId ?? '',
    description: getDescriptionText(product.description),
    discountPrice: product.discountPrice,
    dku: product.dku ?? '',
    featuredOrder: product.featuredOrder ?? 9999,
    images: product.images ?? [],
    isFeatured: product.isFeatured ?? false,
    name: product.name,
    price: product.price,
    productStatus: product.productStatus ?? 'draft',
    seoDescription: product.seoDescription ?? '',
    seoTitle: product.seoTitle ?? '',
    slug: product.slug,
    stock: product.stock,
    tagIds: product.tags?.map((tag: { documentId: string }) => tag.documentId) ?? [],
    type: product.type ?? '',
    volume: product.volume ?? '',
  };
}

function getDescriptionText(description: unknown): string {
  if (typeof description === 'string') return description;
  if (!description || typeof description !== 'object') return '';

  const blocks = description as Record<string, unknown>;
  return typeof blocks.html === 'string'
    ? blocks.html
    : typeof blocks.text === 'string'
      ? blocks.text
      : '';
}

function readProductOptions(options: unknown): ProductOption[] {
  if (Array.isArray(options)) return options as ProductOption[];
  if (!options || typeof options !== 'object') return [];

  return Object.entries(options).map(([name, values]) => ({
    name,
    values: Array.isArray(values) ? values.map(String) : [String(values)],
  }));
}
