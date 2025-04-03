import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Pressable, useColorScheme } from "react-native";
import { colors } from "src/styles/colors";

export const HamburgerMenuButton = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === "dark";
  const theme = isDark ? colors.dark : colors.light;

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ paddingHorizontal: 16 }}
    >
      <Ionicons name="menu" color={theme.secondary} size={28} />
    </Pressable>
  );
};
