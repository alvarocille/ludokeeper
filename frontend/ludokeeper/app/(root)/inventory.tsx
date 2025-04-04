import { useColorScheme, View } from "react-native";
import { LogoDynamic } from "src/components/logo/LogoDynamic";
import { colors } from "src/styles/colors";
import { screenStyles } from "src/styles/screen";

export default function InventoryScreen() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];

  return (
    <View
      style={[
        screenStyles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <LogoDynamic />
    </View>
  );
}
