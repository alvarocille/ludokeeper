import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type DiceFace6Props = {
  value: 1 | 2 | 3 | 4 | 5 | 6;
  size: number;
  dotColor: string;
};

const DOT_RADIUS = 6;

export default function DiceFace6({ value, size, dotColor }: DiceFace6Props) {
  const center = size / 2;
  const quarter = size / 4;

  const positions: Record<number, [number, number][]> = {
    1: [[center, center]],
    2: [
      [quarter, quarter],
      [3 * quarter, 3 * quarter],
    ],
    3: [
      [quarter, quarter],
      [center, center],
      [3 * quarter, 3 * quarter],
    ],
    4: [
      [quarter, quarter],
      [quarter, 3 * quarter],
      [3 * quarter, quarter],
      [3 * quarter, 3 * quarter],
    ],
    5: [
      [quarter, quarter],
      [quarter, 3 * quarter],
      [center, center],
      [3 * quarter, quarter],
      [3 * quarter, 3 * quarter],
    ],
    6: [
      [quarter, quarter],
      [quarter, center],
      [quarter, 3 * quarter],
      [3 * quarter, quarter],
      [3 * quarter, center],
      [3 * quarter, 3 * quarter],
    ],
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {positions[value].map(([cx, cy], index) => (
          <Circle key={index} cx={cx} cy={cy} r={DOT_RADIUS} fill={dotColor} />
        ))}
      </Svg>
    </View>
  );
}
