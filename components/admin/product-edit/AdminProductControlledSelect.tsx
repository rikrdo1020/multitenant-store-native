import { Controller } from 'react-hook-form';
import { Select } from '@/components/ui/Select';
import type { AdminProductEditViewModel, ProductFormValues } from '@/hooks/use-admin-product-edit-screen';

type ProductFormKey = Extract<keyof ProductFormValues, string>;

interface AdminProductControlledSelectProps {
  product: AdminProductEditViewModel;
  name: ProductFormKey;
  label: string;
  options: { label: string; value: string }[];
}

export function AdminProductControlledSelect({
  product,
  name,
  label,
  options,
}: AdminProductControlledSelectProps) {
  return (
    <Controller
      control={product.control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Select label={label} value={String(value ?? '')} onValueChange={onChange} options={options} />
      )}
    />
  );
}
