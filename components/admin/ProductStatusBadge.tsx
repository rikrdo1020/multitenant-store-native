import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { ProductStatus } from '@/types';

const statusConfig: Record<ProductStatus, { label: string; color: string; textColor: string }> = {
  draft: { label: 'Borrador', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
  published: { label: 'Publicado', color: 'bg-green-100', textColor: 'text-green-800' },
  archived: { label: 'Archivado', color: 'bg-gray-100', textColor: 'text-gray-800' },
};

interface ProductStatusBadgeProps {
  status?: ProductStatus;
}

export function ProductStatusBadge({ status = 'draft' }: ProductStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.draft;
  return (
    <View className={cn('rounded-full px-2.5 py-0.5', config.color)}>
      <Text variant="xs" className={cn('font-medium', config.textColor)}>
        {config.label}
      </Text>
    </View>
  );
}
