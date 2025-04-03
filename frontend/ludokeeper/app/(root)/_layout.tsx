import { useWindowDimensions } from "react-native";
import DrawerLayout from "src/components/layouts/drawer-layout";
import TabsLayout from "src/components/layouts/tabs-layout";

export default function ResponsiveLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return isLargeScreen ? <DrawerLayout /> : <TabsLayout />;
}
