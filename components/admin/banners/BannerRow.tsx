import type { ReactNode } from 'react';
import { Image, Switch, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import type { StoreBanner } from '@/types';

interface BannerRowProps {
  banner: StoreBanner;
  isFirst: boolean;
  isLast: boolean;
  disabled: boolean;
  onEdit: (banner: StoreBanner) => void;
  onRemove: (banner: StoreBanner) => void;
  onToggleActive: (banner: StoreBanner) => void;
  onMoveUp: (banner: StoreBanner) => void;
  onMoveDown: (banner: StoreBanner) => void;
}

export function BannerRow({
  banner,
  isFirst,
  isLast,
  disabled,
  onEdit,
  onRemove,
  onToggleActive,
  onMoveUp,
  onMoveDown,
}: BannerRowProps) {
  return (
    <View className="gap-3 border-t border-border p-4 md:flex-row md:items-center">
      {banner.imageUrl ? (
        <Image source={{ uri: banner.imageUrl }} className="h-24 w-full rounded-md bg-muted md:w-40" resizeMode="cover" />
      ) : (
        <View className="h-24 w-full rounded-md bg-muted md:w-40" />
      )}
      <View className="min-w-0 flex-1 gap-1">
        <Text className="font-semibold text-foreground" numberOfLines={1}>{banner.title}</Text>
        {banner.subtitle && <Text variant="small" numberOfLines={2}>{banner.subtitle}</Text>}
        <Text variant="xs">Orden {banner.order}</Text>
      </View>
      <View className="flex-row items-center justify-between gap-3 md:justify-end">
        <Switch value={banner.active} disabled={disabled} onValueChange={() => onToggleActive(banner)} />
        <IconButton disabled={disabled || isFirst} onPress={() => onMoveUp(banner)} icon={<ChevronUp size={18} color="#18181b" />} />
        <IconButton disabled={disabled || isLast} onPress={() => onMoveDown(banner)} icon={<ChevronDown size={18} color="#18181b" />} />
        <IconButton disabled={disabled} onPress={() => onEdit(banner)} icon={<Pencil size={18} color="#18181b" />} />
        <IconButton disabled={disabled} onPress={() => onRemove(banner)} destructive icon={<Trash2 size={18} color="#dc2626" />} />
      </View>
    </View>
  );
}

function IconButton({
  icon,
  destructive,
  disabled,
  onPress,
}: {
  icon: ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      className={`rounded-md border p-2 ${destructive ? 'border-red-100 bg-red-50' : 'border-border bg-background'} ${disabled ? 'opacity-30' : ''}`}
    >
      {icon}
    </TouchableOpacity>
  );
}
