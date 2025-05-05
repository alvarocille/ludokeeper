import { Stack } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { BackButton } from "src/components/button/BackButton";
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
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTitleStyle: {
            color: themeColors.text,
            fontFamily: fonts.heading,
            fontSize: 20,
          },
          headerTintColor: themeColors.secondary,
          headerLeft: () => <BackButton />,
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
