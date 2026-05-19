import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper } from '@/components/shared/ScreenWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { ImagePickerField } from '@/components/ui/ImagePickerField';
import { ProductOptionsField } from '@/components/ui/ProductOptionsField';
import { RichTextField } from '@/components/ui/RichTextField';
import { Button } from '@/components/ui/Button';
import { useProduct } from '@/hooks/api/use-product';
import { useCategories } from '@/hooks/api/use-categories';
import { useBrands } from '@/hooks/api/use-brands';
import { useTags } from '@/hooks/api/use-tags';
import { useProductTypes } from '@/hooks/api/use-product-types';
import { useCreateProduct } from '@/hooks/api/use-create-product';
import { useUpdateProduct } from '@/hooks/api/use-update-product';
import { useUploadImage } from '@/hooks/api/use-upload-image';
import { slugify, generateDKU, sanitizeDecimalInput, sanitizeIntegerInput } from '@/lib/utils';
import type { ProductOption } from '@/types';
import { ChevronLeft } from 'lucide-react-native';

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

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminProductEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === 'new';

  const { data: existingProduct, isLoading: loadingProduct } = useProduct(
    undefined,
    isNew ? undefined : id
  );
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: tags } = useTags();
  const { data: productTypes } = useProductTypes();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadImage();

  const [options, setOptions] = useState<ProductOption[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
    },
  });

  const nameValue = watch('name');

  useEffect(() => {
    if (isNew) {
      reset({
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
      });
      setOptions([]);
      return;
    }

    if (!isNew && existingProduct) {
      const p = existingProduct;
      const descriptionText =
        typeof p.description === 'string'
          ? p.description
          : typeof p.description === 'object' && p.description !== null
            ? (p.description as any).html || (p.description as any).text || ''
            : '';

      reset({
        name: p.name,
        slug: p.slug,
        description: descriptionText,
        price: p.price,
        discountPrice: p.discountPrice,
        dku: p.dku ?? '',
        stock: p.stock,
        productStatus: p.productStatus ?? 'draft',
        type: p.type ?? '',
        volume: p.volume ?? '',
        categoryId: p.category?.documentId ?? '',
        brandId: p.brand?.documentId ?? '',
        tagIds: p.tags?.map((t) => t.documentId) ?? [],
        images: p.images ?? [],
        isFeatured: p.isFeatured ?? false,
        featuredOrder: p.featuredOrder ?? 9999,
        seoTitle: p.seoTitle ?? '',
        seoDescription: p.seoDescription ?? '',
      });
      if (Array.isArray(p.options)) {
        setOptions(p.options as ProductOption[]);
      } else if (p.options && typeof p.options === 'object') {
        // Convert old flat object format to array format if needed
        const parsed = Object.entries(p.options).map(([name, values]) => ({
          name,
          values: Array.isArray(values) ? values : [String(values)],
        }));
        setOptions(parsed);
      } else {
        setOptions([]);
      }
    }
  }, [existingProduct, isNew, reset]);

  useEffect(() => {
    if (isNew && nameValue) {
      setValue('slug', slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isNew, setValue]);

  useEffect(() => {
    if (isNew && nameValue && !watch('dku')) {
      setValue('dku', generateDKU(nameValue), { shouldValidate: true });
    }
  }, [nameValue, isNew, watch, setValue]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setUploadingIndex(0);
      uploadImage.mutate(
        { fileUri: uri, folder: 'products' },
        {
          onSuccess: (data) => {
            const current = watch('images');
            setValue('images', [...current, data.url], { shouldValidate: true });
          },
          onSettled: () => setUploadingIndex(null),
        }
      );
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    const payload = {
      ...values,
      description: values.description
        ? { html: values.description }
        : undefined,
      discountPrice: values.discountPrice || undefined,
      options: options.length > 0 ? options : undefined,
    };

    if (isNew) {
      createProduct.mutate(payload, {
        onSuccess: () => router.replace('/(admin)/products'),
      });
    } else {
      updateProduct.mutate(
        { id: existingProduct!.documentId, payload },
        { onSuccess: () => router.back() }
      );
    }
  };

  const isSubmitting = createProduct.isPending || updateProduct.isPending;

  if (!isNew && loadingProduct) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Stack.Screen
        options={{
          title: isNew ? 'Nuevo Producto' : 'Editar Producto',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ChevronLeft size={24} className="text-foreground" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 p-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input label="Nombre" value={value} onChangeText={onChange} error={errors.name?.message} />
          )}
        />

        <Controller
          control={control}
          name="slug"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Slug"
              value={value}
              onChangeText={onChange}
              error={errors.slug?.message}
              editable={!isNew}
              className={!isNew ? 'bg-muted text-muted-foreground' : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <RichTextField
              label="Descripción"
              value={value ?? ''}
              onChange={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Precio"
              value={value?.toString()}
              onChangeText={(text) => onChange(sanitizeDecimalInput(text).replace(',', '.'))}
              keyboardType="decimal-pad"
              error={errors.price?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="discountPrice"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Precio de oferta"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(text ? sanitizeDecimalInput(text).replace(',', '.') : text)}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="dku"
          render={({ field: { onChange, value } }) => (
            <Input
              label="DKU"
              value={value}
              onChangeText={onChange}
              error={errors.dku?.message}
              editable={isNew}
              className={!isNew ? 'bg-muted text-muted-foreground' : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="stock"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Stock"
              value={value?.toString() ?? ''}
              onChangeText={(text) => onChange(sanitizeIntegerInput(text))}
              keyboardType="number-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="productStatus"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Estado"
              value={value ?? ''}
              onValueChange={onChange}
              options={[
                { label: 'Borrador', value: 'draft' },
                { label: 'Publicado', value: 'published' },
                { label: 'Archivado', value: 'archived' },
              ]}
            />
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Categoría"
              value={value ?? ''}
              onValueChange={onChange}
              options={
                categories?.map((c) => ({ label: c.name, value: c.documentId })) ?? []
              }
            />
          )}
        />

        <Controller
          control={control}
          name="brandId"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Marca"
              value={value ?? ''}
              onValueChange={onChange}
              options={
                brands?.map((b) => ({ label: b.name, value: b.documentId })) ?? []
              }
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Tipo de producto"
              value={value ?? ''}
              onValueChange={onChange}
              options={
                productTypes?.map((t) => ({ label: t.name, value: t.name })) ?? []
              }
            />
          )}
        />

        <Controller
          control={control}
          name="tagIds"
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              label="Tags"
              values={value}
              onChange={onChange}
              options={tags?.map((t) => ({ label: t.name, value: t.documentId })) ?? []}
            />
          )}
        />

        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value } }) => (
            <ImagePickerField
              label="Imágenes"
              images={value}
              onImagesChange={onChange}
              onPickImage={handlePickImage}
              uploading={uploadingIndex !== null}
            />
          )}
        />

        <ProductOptionsField
          value={options}
          onChange={setOptions}
        />

        <Controller
          control={control}
          name="seoTitle"
          render={({ field: { onChange, value } }) => (
            <Input label="SEO Título" value={value ?? ''} onChangeText={onChange} />
          )}
        />

        <Controller
          control={control}
          name="seoDescription"
          render={({ field: { onChange, value } }) => (
            <Input label="SEO Descripción" value={value ?? ''} onChangeText={onChange} multiline />
          )}
        />

        <Button
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          {isNew ? 'Crear producto' : 'Guardar cambios'}
        </Button>

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  );
}
