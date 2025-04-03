import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "src/store/authStore";

export default function RootLayout() {
  const { token, isLoading, loadToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (isLoading) return;

    const currentPath = segments.join("/");

    const publicPaths = [
      "(auth)/login",
      "(auth)/register",
      "(root)/main/settings",
    ];

    const isPublicPage = publicPaths.includes(currentPath);

    if (!token && !isPublicPage) {
      router.replace("/(auth)/login");
    }

    if (token && currentPath.startsWith("(auth)")) {
      router.replace("(root)/inventory");
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
