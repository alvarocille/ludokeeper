import { Stack } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { BackButton } from "src/components/button/BackButton";
import { ThemeMode, useThemeStore } from "src/store/themeStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: "Claro", value: "light" },
  { label: "Oscuro", value: "dark" },
  { label: "Sistema", value: "system" },
];

export default function SettingsScreen() {
  const { colors, fonts } = useAppTheme();
  const styles = useScreenStyles();
  const { width } = useWindowDimensions();
  const systemTheme = useColorScheme();
  const { themeMode, setThemeMode } = useThemeStore();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Configuración",
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: {
            color: colors.text,
            fontFamily: fonts.heading,
            fontSize: 20,
          },
          headerTintColor: colors.secondary,
          headerLeft: () => <BackButton />,
        }}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <Text style={styles.title}>Apariencia</Text>

        <Text
          style={{
            ...styles.itemText,
            marginBottom: 12,
          }}
        >
          Selecciona el modo de tema preferido:
        </Text>

        {themeOptions.map((option) => {
          const isSelected = themeMode === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => setThemeMode(option.value)}
              style={{
                backgroundColor: isSelected
                  ? colors.secondary + "33"
                  : colors.primary,
                borderColor: colors.secondary,
                borderWidth: isSelected ? 2 : 1,
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.text,
                  color: colors.text,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}
