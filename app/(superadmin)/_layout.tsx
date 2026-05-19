import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { SuperadminDrawerContent } from "@/components/superadmin/SuperadminDrawerContent";
import { useAuthStore } from "@/stores/use-auth-store";

export default function SuperadminLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (user?.role !== "superadmin") {
      router.replace("/(admin)/dashboard");
    }
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated || user?.role !== "superadmin") return null;

  return (
    <Drawer
      drawerContent={(props) => <SuperadminDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerType: "front",
        swipeEnabled: true,
        overlayColor: "rgba(0,0,0,0.5)",
      }}
    >
      <Drawer.Screen name="dashboard" options={{ title: "Panel Global" }} />
      <Drawer.Screen name="tenants/index" options={{ title: "Tenants" }} />
      <Drawer.Screen
        name="tenants/[id]"
        options={{ title: "Detalle de Tenant", drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen name="users/index" options={{ title: "Usuarios" }} />
    </Drawer>
  );
}
