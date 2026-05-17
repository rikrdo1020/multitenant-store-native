import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Home } from "lucide-react-native";

export default function StorefrontLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.OS === "web" ? { display: "none" } : undefined,
      }}
    >
      <Tabs.Screen
        name="[tenantSlug]"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
