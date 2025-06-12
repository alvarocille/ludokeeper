import { useRouter } from "expo-router";
import { View } from "react-native";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function MenuScreen() {
  const { colors } = useAppTheme();
  const styles = useScreenStyles();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return <View style={styles.container}></View>;
}
