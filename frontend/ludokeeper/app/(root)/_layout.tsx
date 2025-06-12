import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import DrawerLayout from "src/components/layouts/drawerLayout";
import TabsLayout from "src/components/layouts/tabsLayout";
import { useAuthStore } from "src/store/authStore";

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().loadToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return Platform.OS === "web" ? <DrawerLayout /> : <TabsLayout />;
}
