import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { colors } from "src/styles/colors";
import { screenStyles } from "src/styles/screen";

export const BackButton = () => {
  const router = useRouter();
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={themeColors.secondary}
        style={screenStyles.icon}
      />
    </Pressable>
  );
};
