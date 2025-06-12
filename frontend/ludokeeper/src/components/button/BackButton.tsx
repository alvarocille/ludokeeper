import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "src/styles/useAppTheme";

export const BackButton = () => {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleBack = () => {
    try {
      if (router.canGoBack?.()) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (e) {
      router.replace("/");
    }
  };

  return (
    <Pressable onPress={handleBack} style={styles.button}>
      <Ionicons
        name="arrow-back"
        size={24}
        color={colors.secondary}
        style={styles.icon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  icon: {
    width: 24,
    textAlign: "center",
  },
});
