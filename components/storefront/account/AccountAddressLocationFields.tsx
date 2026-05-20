import { View, useWindowDimensions } from 'react-native';
import { AccountControlledInput } from './AccountControlledInput';
import type { CustomerAddressFormData } from '@/lib/validators';
import type { Control } from 'react-hook-form';

interface AccountAddressLocationFieldsProps {
  control: Control<CustomerAddressFormData>;
  isSubmitting: boolean;
}

export function AccountAddressLocationFields({
  control,
  isSubmitting,
}: AccountAddressLocationFieldsProps) {
  const { width } = useWindowDimensions();

  return (
    <View className={width >= 640 ? 'flex-row gap-3' : 'gap-3'}>
      <View className="min-w-0 flex-1">
        <AccountControlledInput control={control} name="city" label="Ciudad" editable={!isSubmitting} />
      </View>
      <View className="min-w-0 flex-1">
        <AccountControlledInput
          control={control}
          name="department"
          label="Departamento"
          editable={!isSubmitting}
        />
      </View>
    </View>
  );
}
