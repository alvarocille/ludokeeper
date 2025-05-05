import { Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "react-native";
import { navigationItems } from "src/constants/navItems";
import { colors } from "src/styles/colors";
import { fonts } from "src/styles/fonts";

export default function DrawerLayout() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: themeColors.background,
        },
        drawerLabelStyle: {
          color: themeColors.text,
          fontFamily: fonts.text,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTitleStyle: {
          color: themeColors.text,
          fontFamily: fonts.heading,
          fontSize: 20,
        },
        headerTintColor: themeColors.secondary,
      }}
    >
      {navigationItems.map((item) => (
        <Drawer.Screen
          key={item.name}
          name={item.name}
          options={{
            drawerLabel: item.title,
            title: item.title,
          }}
        />
      ))}
      <Slot />
    </Drawer>
  );
}
