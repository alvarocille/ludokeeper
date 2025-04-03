import { tabIconMap } from "src/constants/icons";
import { colors } from "src/styles/colors";
import { fonts } from "src/styles/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTitleStyle: {
          color: themeColors.text,
          fontFamily: fonts.heading,
          fontSize: 20,
        },
        tabBarActiveTintColor: themeColors.secondary,
        tabBarInactiveTintColor: themeColors.text,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = tabIconMap[route.name as keyof typeof tabIconMap];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="inventory" options={{ title: "Inventario" }} />
      <Tabs.Screen name="matches" options={{ title: "Partidas" }} />
      <Tabs.Screen name="tools" options={{ title: "Herramientas" }} />
      <Tabs.Screen name="explore" options={{ title: "Explorar" }} />
      <Tabs.Screen name="other" options={{ title: "Otro" }} />
    </Tabs>
  );
}
