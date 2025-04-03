import { colors } from "src/styles/colors";
import { fonts } from "src/styles/fonts";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "react-native";

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
      <Drawer.Screen
        name="inventory"
        options={{ drawerLabel: "Inventario", title: "Inventario" }}
      />
      <Drawer.Screen
        name="matches"
        options={{ drawerLabel: "Partidas", title: "Partidas" }}
      />
      <Drawer.Screen
        name="tools"
        options={{ drawerLabel: "Herramientas", title: "Herramientas" }}
      />
      <Drawer.Screen
        name="explore"
        options={{ drawerLabel: "Explorar", title: "Explorar" }}
      />
      <Drawer.Screen
        name="other"
        options={{ drawerLabel: "Otro", title: "Otro" }}
      />
    </Drawer>
  );
}
