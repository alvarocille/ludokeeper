import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { menuItems } from "src/constants/navItems";
import { useAuthStore } from "src/store/authStore";
import { colors } from "src/styles/colors";
import { screenStyles } from "src/styles/screen";

export default function MenuScreen() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View
      style={[
        screenStyles.container,
        { backgroundColor: themeColors.background },
      ]}
    >
      <Text style={[screenStyles.title, { color: themeColors.text }]}>
        Menú
      </Text>

      {menuItems.map((item, index) => (
        <Pressable
          key={index}
          style={screenStyles.item}
          onPress={() => {
            if (item.title === "Cerrar sesión") {
              console.log("[UI] Pulsado botón Cerrar sesión");
              handleLogout();
            } else if (item.route) {
              router.push(item.route);
            }
          }}
        >
          <Ionicons
            name={item.icon}
            size={24}
            color={themeColors.text}
            style={screenStyles.icon}
          />
          <Text style={[screenStyles.itemText, { color: themeColors.text }]}>
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
