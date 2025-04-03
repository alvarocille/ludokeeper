import { colors } from "src/styles/colors";
import { fonts } from "src/styles/fonts";
import { screenStyles } from "src/styles/screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";

export default function SettingsScreen() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];
  const navigation = useNavigation();
  const router = useRouter();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace("/(root)/main/tabs/inventory");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Configuración",
          headerStyle: { backgroundColor: themeColors.background },
          headerTitleStyle: {
            fontFamily: fonts.heading,
            color: themeColors.text,
          },
          headerLeft: () => (
            <Pressable onPress={handleGoBack} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="arrow-back" size={24} color={themeColors.text} />
            </Pressable>
          ),
        }}
      />

      <View
        style={[
          screenStyles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Text style={[screenStyles.title, { color: themeColors.text }]}>
          Configuración
        </Text>
      </View>
    </>
  );
}
