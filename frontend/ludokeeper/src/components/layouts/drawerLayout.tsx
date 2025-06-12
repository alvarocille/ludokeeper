import { Slot } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { navigationItems } from "src/constants/navItems";
import { useAppTheme } from "src/styles/useAppTheme";

export default function DrawerLayout() {
  const { colors, fonts } = useAppTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerLabelStyle: {
          color: colors.text,
          fontFamily: fonts.text,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: fonts.heading,
          fontSize: 20,
        },
        headerTintColor: colors.secondary,
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
