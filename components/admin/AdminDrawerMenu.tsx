import { ScrollView, TouchableOpacity, View } from 'react-native';
import { adminDrawerMenuItems } from '@/components/admin/admin-drawer-menu-items';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import type { DrawerMenuSection } from '@/components/admin/drawer-menu-types';

interface AdminDrawerMenuProps {
  pathname: string;
  onNavigate: (href: string) => void;
  sections?: readonly DrawerMenuSection[];
}

export function AdminDrawerMenu({
  pathname,
  onNavigate,
  sections = [{ items: adminDrawerMenuItems }],
}: AdminDrawerMenuProps) {
  return (
    <ScrollView className="flex-1 px-2 py-2">
      {sections.map((section, sectionIndex) => (
        <View key={section.title ?? sectionIndex} className="mb-3">
          {section.title && (
            <Text variant="xs" className="mb-1 px-3 font-semibold uppercase text-muted-foreground">
              {section.title}
            </Text>
          )}

          {section.disabled && section.disabledMessage && (
            <Text
              variant="xs"
              className="mb-2 rounded-md bg-muted px-3 py-2 text-muted-foreground"
            >
              {section.disabledMessage}
            </Text>
          )}

          {section.items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <TouchableOpacity
                key={`${section.title ?? 'menu'}-${item.href}`}
                disabled={section.disabled}
                onPress={() => onNavigate(item.href)}
                className={cn(
                  'flex-row items-center rounded-lg px-3 py-3',
                  isActive ? 'bg-primary/10' : 'bg-transparent',
                  section.disabled ? 'opacity-40' : '',
                )}
              >
                <Icon
                  size={20}
                  className={cn(isActive ? 'text-primary' : 'text-muted-foreground')}
                />
                <Text
                  variant="body"
                  className={cn(
                    'ml-3 font-medium',
                    isActive ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}
