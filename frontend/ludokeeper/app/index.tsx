import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator,  View } from "react-native";
import { useAuthStore } from "src/store/authStore";

export default function Index() {
  const { isAuthenticated, isLoading, loadToken } = useAuthStore();

  useEffect(() => {
    loadToken();
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

  return <Redirect href="/(root)/inventory" />;
}
