import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface AuthHeroProps {
  title: string;
  subtitle: string;
}

export function AuthHero({ title, subtitle }: AuthHeroProps) {
  return (
    <View className="px-6 pb-8 pt-10">
      <Text className="text-[52px] font-bold leading-[1] text-foreground">
        {title}
      </Text>
      <View className="mt-5 flex-row items-center gap-3">
        <View className="h-[1.5px] w-6 bg-foreground" />
        <Text className="text-sm tracking-wide text-muted-foreground">{subtitle}</Text>
      </View>
    </View>
  );
}
