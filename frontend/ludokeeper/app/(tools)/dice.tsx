import { Stack } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { BackButton } from "src/components/button/BackButton";
import DiceFace6 from "src/components/tools/DiceFace6";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

const DICE_TYPES = [4, 6, 8, 10, 12, 20];

export default function DiceScreen() {
  const { colors, fonts } = useAppTheme();
  const styles = useScreenStyles();
  const { width } = useWindowDimensions();

  const [sides, setSides] = useState(6);
  const [result, setResult] = useState<number>(() =>
    Math.floor(Math.random() * 6 + 1)
  );
  const diceSize = Math.min(width * 0.4, 140);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rollDice = () => {
    // animación bounce
    scale.value = withSequence(
      withTiming(0.85, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );

    // vibración suave
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // resultado aleatorio
    const rolled = Math.floor(Math.random() * sides) + 1;
    setResult(rolled);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Simulador de Dado",
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

      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        {/* Parte superior: título y selector */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Text
            style={[styles.title, { textAlign: "center", marginBottom: 12 }]}
          >
            Dado de {sides} caras
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              alignItems: "center",
            }}
          >
            {DICE_TYPES.map((type) => {
              const isSelected = sides === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => {
                    setSides(type);
                    setResult(Math.floor(Math.random() * type + 1));
                  }}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    marginRight: 8,
                    backgroundColor: isSelected
                      ? colors.secondary
                      : colors.card,
                    borderColor: colors.border,
                    borderWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.text,
                      fontSize: 16,
                      color: isSelected ? colors.background : colors.text,
                    }}
                  >
                    D{type}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Parte central: dado animado y resultado */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable onPress={rollDice} style={{ marginBottom: 16 }}>
            <Animated.View
              style={[
                {
                  width: diceSize,
                  height: diceSize,
                  borderRadius: 16,
                  backgroundColor: colors.card,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                  borderColor: colors.secondary,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                },
                animatedStyle,
              ]}
            >
              {sides === 6 ? (
                <DiceFace6
                  value={result as 1 | 2 | 3 | 4 | 5 | 6}
                  size={diceSize}
                  dotColor={colors.text}
                />
              ) : (
                <Text
                  style={{
                    fontSize: diceSize / 2.2,
                    fontFamily: fonts.heading,
                    color: colors.text,
                  }}
                >
                  {result}
                </Text>
              )}
            </Animated.View>
          </Pressable>

          <Text
            style={{
              ...styles.itemText,
              textAlign: "center",
              opacity: 0.6,
            }}
          >
            Toca el dado para lanzar
          </Text>
        </View>
      </View>
    </>
  );
}
