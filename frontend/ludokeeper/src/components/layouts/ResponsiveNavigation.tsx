// src/components/layouts/ResponsiveNavigation.tsx
import { useWindowDimensions } from "react-native";
import DrawerLayout from "./drawerLayout";
import TabsLayout from "./tabsLayout";

export default function ResponsiveNavigation() {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  return isLarge ? <DrawerLayout /> : <TabsLayout />;
}
