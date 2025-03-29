import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useAuthStore } from "../src/store/authStore";

export default function Home() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout); // 👈 usamos logout real

  const handleLogout = async () => {
    await logout(); // elimina token de memoria y de AsyncStorage
    router.replace("/"); // opcional, el layout también puede redirigir
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bienvenido a LudoKeeper 🧩</Text>
      <Button
        title="Ir a configuración"
        onPress={() => router.push("/settings")}
      />
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
