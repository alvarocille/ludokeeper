import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { toolItems } from "src/constants/navItems";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function ToolsScreen() {
  const { colors } = useAppTheme();
  const styles = useScreenStyles();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  const items = [...toolItems];

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.item}
          onPress={() => {
            if (item.title === "Cerrar sesión") {
              handleLogout();
            } else if (item.route) {
              router.push(item.route);
            }
          }}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={colors.text}
            style={styles.icon}
          />
          <Text style={styles.itemText}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}
