import { Stack } from "expo-router";
import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { BackButton } from "src/components/button/BackButton";
import Cille from "src/components/logo/Cille";
import { LogoDynamic } from "src/components/logo/LogoDynamic";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function AboutScreen() {
  const { colors, fonts } = useAppTheme();
  const styles = useScreenStyles();
  const { width } = useWindowDimensions();
  const screenHeight = Dimensions.get("window").height;
  const maxLogoWidth = Math.min(width * 0.6, 240);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Acerca de",
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
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <Text style={styles.title}>Acerca de Ludokeeper</Text>

        <Text
          style={{
            ...styles.itemText,
            textAlign: "center",
            maxWidth: 600,
            marginBottom: 32,
          }}
        >
          LudoKeeper es una aplicación de gestión de juegos de mesa y partidas.
          Está diseñada con una arquitectura de microservicios la cual cuenta
          con integración con Keycloak para la autenticación, varios endpoints
          creados con Express para Node.js y una interfaz multiplataforma
          desarrollada con React Native y Expo.
          {"\n\n"}
          Esta aplicación se ha creado por Álvaro Cilleruelo Sinovas como
          proyecto final del grado en Desarrollo de Aplicaciones Multiplataforma
          y puede encontrarse en:
        </Text>

        <Pressable
          onPress={() =>
            Linking.openURL("https://github.com/alvarocille/ludokeeper")
          }
        >
          <Text
            style={{
              ...styles.itemText,
              textAlign: "center",
              color: colors.secondary,
              textDecorationLine: "underline",
            }}
          >
            https://github.com/alvarocille/ludokeeper
          </Text>
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            marginTop: 16,
          }}
        >
          <Cille width={maxLogoWidth * 0.8} height={maxLogoWidth * 0.8} />
          <View style={{ width: maxLogoWidth * 0.8 }}>
            <LogoDynamic />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
