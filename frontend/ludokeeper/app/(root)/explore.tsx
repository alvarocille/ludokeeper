import { View } from "react-native";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function MenuScreen() {
  const { colors } = useAppTheme();
  const styles = useScreenStyles();

  return <View style={styles.container}></View>;
}
