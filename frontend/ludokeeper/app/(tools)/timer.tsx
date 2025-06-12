import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useRef as useAnimRef, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { BackButton } from "src/components/button/BackButton";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

const PRESETS = [60, 300, 600]; // en segundos

export default function TimerScreen() {
  const { colors, fonts } = useAppTheme();
  const styles = useScreenStyles();

  const [seconds, setSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const [input, setInput] = useState("60");
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
    if (running || remaining <= 0) return;
    setRunning(true);
    interval.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval.current!);
          setRunning(false);
          shakeRef.current?.shake?.(800); // Vibración visual
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (interval.current) clearInterval(interval.current);
    setRunning(false);
  };

  const reset = () => {
    pause();
    setRemaining(seconds);
  };

  const setPreset = (s: number) => {
    pause();
    setSeconds(s);
    setRemaining(s);
    setInput(String(s));
  };

  const applyInput = (val: string) => {
    setInput(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed > 0) {
      setSeconds(parsed);
      setRemaining(parsed);
    }
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
          title: "Temporizador",
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
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: 24,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Tiempo actual */}
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
              {formatTime(remaining)}
            </Text>
          </Animatable.View>
        </View>

        {/* Presets + Input */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {PRESETS.map((p) => {
            const isActive = seconds === p;
            return (
              <Pressable
                key={p}
                onPress={() => setPreset(p)}
                style={{
                  backgroundColor: isActive ? colors.secondary : colors.card,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.text,
                    fontSize: 16,
                    color: isActive ? colors.background : colors.text,
                  }}
                >
                  {p / 60} min
                </Text>
              </Pressable>
            );
          })}

          {/* Input de segundos */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
              minWidth: 90,
            }}
          >
            <TextInput
              keyboardType="numeric"
              value={input}
              onChangeText={applyInput}
              placeholder="seg"
              placeholderTextColor={colors.placeholder}
              style={{
                fontFamily: fonts.text,
                fontSize: 16,
                color: colors.text,
                flex: 1,
                textAlign: "center",
                padding: 0,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.text,
                color: colors.text,
                fontSize: 14,
              }}
            >
              seg
            </Text>
          </View>
        </View>

        {/* Controles */}
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
              backgroundColor:
                !running && remaining !== seconds
                  ? colors.secondary
                  : colors.card,
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
              color={
                !running && remaining !== seconds
                  ? colors.background
                  : colors.text
              }
            />
            <Text
              style={{
                fontFamily: fonts.text,
                color:
                  !running && remaining !== seconds
                    ? colors.background
                    : colors.text,
              }}
            >
              Pausar
            </Text>
          </Pressable>

          <Pressable
            onPress={reset}
            style={{
              backgroundColor:
                remaining !== seconds && !running
                  ? colors.secondary
                  : colors.card,
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
              color={
                remaining !== seconds && !running
                  ? colors.background
                  : colors.text
              }
            />
            <Text
              style={{
                fontFamily: fonts.text,
                color:
                  remaining !== seconds && !running
                    ? colors.background
                    : colors.text,
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
