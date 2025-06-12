import { navigationItems } from "src/constants/navItems";
import { useAppTheme } from "src/styles/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Slot, Tabs } from "expo-router";

export default function TabsLayout() {
  const { colors, fonts } = useAppTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontFamily: fonts.heading,
          fontSize: 20,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
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
