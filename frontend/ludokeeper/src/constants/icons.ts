import { Ionicons } from "@expo/vector-icons";

type TabRoute = "inventory" | "matches" | "tools" | "explore" | "other";

export const tabIconMap: Record<TabRoute, keyof typeof Ionicons.glyphMap> = {
  inventory: "albums",
  matches: "game-controller",
  tools: "construct",
  explore: "search",
  other: "ellipsis-horizontal",
};
