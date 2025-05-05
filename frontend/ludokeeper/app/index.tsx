import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "src/store/authStore";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? "/(root)/inventory" : "/(auth)/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return null;
}
