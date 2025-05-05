import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "src/store/authStore";

export default function RootLayout() {
  const { loadToken, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {!isAuthenticated && <Redirect href="/(auth)/login" />}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
