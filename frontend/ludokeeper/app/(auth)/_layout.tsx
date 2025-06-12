import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "src/store/authStore";

export default function AuthLayout() {
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

  if (isAuthenticated) {
    return <Redirect href="/(root)/inventory" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
