import { Text, useColorScheme, View } from "react-native";
import { colors } from "src/styles/colors";
import { screenStyles } from "src/styles/screen";

export default function ExploreScreen() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];

  return (
    <View
      style={[
        screenStyles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Text style={[screenStyles.title, { color: themeColors.text }]}>
        Explorar
      </Text>
    </View>
  );
}
