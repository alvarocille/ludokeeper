import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "src/store/authStore";

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    router.replace(isAuthenticated ? "/(root)/inventory" : "/(auth)/login");
  }, [isAuthenticated, isLoading, navigationState, router]);

  return null;
}
