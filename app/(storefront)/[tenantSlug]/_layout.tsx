import type { ComponentProps, ReactNode } from "react";
import { Tabs, useLocalSearchParams } from "expo-router";
import { Home, Search, ShoppingCart, User } from "lucide-react-native";
import { useCartCount } from "@/hooks/use-cart-count";
import { firstRouteParam } from "@/lib/route-params";

type TabsWithIdProps = Omit<ComponentProps<typeof Tabs>, "id"> & {
  id?: string;
  children?: ReactNode;
};

const TabsWithId = Tabs as unknown as (props: TabsWithIdProps) => JSX.Element;

export default function TenantLayout() {
  const { tenantSlug: rawTenantSlug } = useLocalSearchParams<{ tenantSlug?: string | string[] }>();
  const tenantSlug = firstRouteParam(rawTenantSlug);
  const cartCount = useCartCount(tenantSlug);

  return (
    <TabsWithId
      id="tenant"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#171717",
        tabBarInactiveTintColor: "#737373",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Catalogo",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Cuenta",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="products/[slug]" options={{ href: null }} />
      <Tabs.Screen name="categories/[slug]" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="orders/index" options={{ href: null }} />
      <Tabs.Screen name="orders/[id]" options={{ href: null }} />
      <Tabs.Screen name="track" options={{ href: null }} />
    </TabsWithId>
  );
}
