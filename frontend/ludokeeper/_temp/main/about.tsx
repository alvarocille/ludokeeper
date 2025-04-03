import { Stack } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { colors } from "src/styles/colors";
import { fonts } from "src/styles/fonts";
import { screenStyles } from "src/styles/screen";

export default function AboutScreen() {
  const theme = useColorScheme();
  const themeColors = colors[theme ?? "light"];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Acerca de",
          headerStyle: { backgroundColor: themeColors.background },
          headerTitleStyle: {
            fontFamily: fonts.heading,
            color: themeColors.text,
          },
        }}
      />

      <View
        style={[
          screenStyles.container,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Text style={[screenStyles.title, { color: themeColors.text }]}>
          Acerca de
        </Text>
      </View>
    </>
  );
}
