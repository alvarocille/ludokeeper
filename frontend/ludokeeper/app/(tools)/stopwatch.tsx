import { Stack } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRef as useAnimRef, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { BackButton } from "src/components/button/BackButton";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function StopwatchScreen() {
  const { colors, fonts } = useAppTheme();
  const styles = useScreenStyles();

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const shakeRef = useAnimRef<Animatable.View & View>();

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    interval.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const pause = () => {
    if (interval.current) clearInterval(interval.current);
    setRunning(false);
  };

  const reset = () => {
    pause();
    setElapsed(0);
  };

  useEffect(() => {
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cronómetro",
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

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background, padding: 24 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animatable.View
            ref={shakeRef}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.secondary,
              borderWidth: 2,
              borderRadius: 16,
              padding: 32,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              minWidth: 180,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontFamily: fonts.heading,
                color: colors.text,
              }}
            >
              {formatTime(elapsed)}
            </Text>
          </Animatable.View>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={start}
            style={{
              backgroundColor: running ? colors.secondary : colors.card,
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons
              name="play"
              size={20}
              color={running ? colors.background : colors.text}
            />
            <Text
              style={{
                fontFamily: fonts.text,
                color: running ? colors.background : colors.text,
              }}
            >
              Iniciar
            </Text>
          </Pressable>

          <Pressable
            onPress={pause}
            style={{
              backgroundColor: !running && elapsed > 0 ? colors.secondary : colors.card,
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons
              name="pause"
              size={20}
              color={!running && elapsed > 0 ? colors.background : colors.text}
            />
            <Text
              style={{
                fontFamily: fonts.text,
                color: !running && elapsed > 0 ? colors.background : colors.text,
              }}
            >
              Pausar
            </Text>
          </Pressable>

          <Pressable
            onPress={reset}
            style={{
              backgroundColor: elapsed > 0 && !running ? colors.secondary : colors.card,
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons
              name="refresh"
              size={20}
              color={elapsed > 0 && !running ? colors.background : colors.text}
            />
            <Text
              style={{
                fontFamily: fonts.text,
                color: elapsed > 0 && !running ? colors.background : colors.text,
              }}
            >
              Reiniciar
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
