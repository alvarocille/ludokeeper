import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../src/store/authStore";

export default function RootLayout() {
  const { token, isLoading, loadToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Cargar token al iniciar
  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (isLoading) return;

    const currentPath = segments.join("/");

    const isAuthPage =
      currentPath === "auth/login" || currentPath === "auth/register";
    const isPublicPage = isAuthPage || currentPath === "settings";

    if (!token && !isPublicPage) {
      router.replace("/auth/login");
    }

    if (token && isAuthPage) {
      router.replace("/home");
    }
  }, [segments, token, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
