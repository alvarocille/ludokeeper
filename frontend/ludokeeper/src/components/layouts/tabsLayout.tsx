import { Ionicons } from "@expo/vector-icons";
import { Slot, Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { navigationItems } from "src/constants/navItems";
import { colors } from "src/styles/colors";
import { fonts } from "src/styles/fonts";

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
          const iconName =
            navigationItems.find((item) => item.name === route.name)?.icon ||
            "ellipse";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {navigationItems.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{ title: item.title }}
        />
      ))}
      <Slot />
    </Tabs>
  );
}
