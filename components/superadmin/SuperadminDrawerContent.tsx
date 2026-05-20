import { ScrollView, TouchableOpacity, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth-store";
import {
  LayoutDashboard,
  Building2,
  Users,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react-native";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

const menuItems = [
  { label: "Dashboard", href: "/(superadmin)/dashboard", icon: LayoutDashboard },
  { label: "Tenants", href: "/(superadmin)/tenants", icon: Building2 },
  { label: "Usuarios", href: "/(superadmin)/users", icon: Users },
];

export function SuperadminDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    props.navigation.closeDrawer();
    router.replace("/(auth)/login");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, padding: 0 }}
    >
      <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
        <View className="flex-row items-center gap-2">
          <ShieldCheck size={18} className="text-primary" />
          <Text variant="h3" className="font-bold">
            Superadmin
          </Text>
        </View>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <X size={24} className="text-foreground" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-2 py-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.href}
              onPress={() => {
                router.push(item.href as any);
                props.navigation.closeDrawer();
              }}
              className={cn(
                "flex-row items-center rounded-lg px-3 py-3",
                isActive ? "bg-primary/10" : "bg-transparent",
              )}
            >
              <Icon
                size={20}
                className={cn(
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <Text
                variant="body"
                className={cn(
                  "ml-3 font-medium",
                  isActive ? "text-primary" : "text-foreground",
                )}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View className="border-t border-border px-4 py-3">
        <Text variant="small" className="mb-2 text-muted-foreground">
          {user?.name ?? user?.email ?? "Superadmin"}
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center gap-2 rounded-md bg-destructive/5 px-3 py-2"
        >
          <LogOut size={18} className="text-destructive" />
          <Text variant="body" className="font-medium text-destructive">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}
