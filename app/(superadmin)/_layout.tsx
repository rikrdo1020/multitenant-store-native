import { Drawer } from "expo-router/drawer";
import { SuperadminDrawerContent } from "@/components/superadmin/SuperadminDrawerContent";
import { useSuperadminRouteGuard } from "@/hooks/use-superadmin-route-guard";

export default function SuperadminLayout() {
  const shouldRender = useSuperadminRouteGuard();

  if (!shouldRender) return null;

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
