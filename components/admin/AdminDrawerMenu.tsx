import { ScrollView, TouchableOpacity, View } from 'react-native';
import { adminDrawerMenuItems } from '@/components/admin/admin-drawer-menu-items';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { useUnreadCount } from '@/hooks/api/use-notifications';
import { adminColors } from '@/lib/admin-theme';
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
  const unreadCount = useUnreadCount();

  return (
    <ScrollView className="flex-1 px-2 py-2" showsVerticalScrollIndicator={false}>
      {sections.map((section, sectionIndex) => (
        <View key={section.title ?? sectionIndex} className="mb-4">
          {section.title && (
            <Text
              variant="xs"
              className="mb-1.5 px-3 font-semibold uppercase tracking-widest text-muted-foreground"
            >
              {section.title}
            </Text>
          )}

          {section.disabled && section.disabledMessage && (
            <Text
              variant="xs"
              className="mb-2 rounded-lg bg-muted px-3 py-2 text-muted-foreground"
            >
              {section.disabledMessage}
            </Text>
          )}

          {section.items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            const iconColor = isActive ? adminColors.foreground : adminColors.mutedForeground;
            const badgeCount =
              item.href === '/(admin)/notifications' ? unreadCount : (item.badge ?? 0);

            return (
              <TouchableOpacity
                key={`${section.title ?? 'menu'}-${item.href}`}
                disabled={section.disabled}
                onPress={() => onNavigate(item.href)}
                activeOpacity={0.6}
                className={cn(
                  'flex-row items-center rounded-xl px-3 py-2.5 mb-0.5',
                  isActive ? 'bg-foreground' : 'bg-transparent',
                  section.disabled ? 'opacity-40' : '',
                )}
              >
                {/* Icon container with subtle padding */}
                <View className="w-7 items-center">
                  <Icon
                    size={18}
                    color={isActive ? adminColors.activeIconColor : iconColor}
                  />
                </View>

                <Text
                  variant="small"
                  className={cn(
                    'ml-2 flex-1 font-medium',
                    isActive ? 'text-background' : 'text-foreground',
                  )}
                >
                  {item.label}
                </Text>

                {badgeCount > 0 && (
                  <View
                    className={cn(
                      'rounded-full min-w-5 h-5 items-center justify-center px-1',
                      isActive ? 'bg-background' : 'bg-foreground',
                    )}
                  >
                    <Text
                      variant="xs"
                      className={cn(
                        'font-semibold',
                        isActive ? 'text-foreground' : 'text-background',
                      )}
                    >
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}
