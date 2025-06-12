import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "src/styles/useAppTheme";

export const HamburgerMenuButton = () => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.button}
    >
      <Ionicons name="menu" color={colors.secondary} size={28} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
  },
});
