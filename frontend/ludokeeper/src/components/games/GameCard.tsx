import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "src/styles/useAppTheme";

export interface Game {
  _id: string;
  userId: string;
  source: "custom" | "catalog";
  customData?: {
    name: string;
    description?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playTime?: number;
    imageUrl?: string;
  };
  gameId?: {
    name: string;
    description?: string;
    minPlayers?: number;
    maxPlayers?: number;
    playTime?: number;
    imageUrl?: string;
    yearPublished?: number;
    publisher?: string;
    categories?: string[];
    mechanics?: string[];
  };
  acquisitionDate?: string;
  notes?: string;
}

interface Props {
  game: Game;
  variant: "inventory" | "catalog";
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
}

export default function GameCard({
  game,
  variant,
  onPress,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  const { colors, fonts } = useAppTheme();

  const { name, minPlayers, maxPlayers, playTime, imageUrl } =
    game.customData || {
      name: "Juego sin datos",
    };

  console.log(game);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: `${colors.text}0D` }]}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: colors.text, fontFamily: fonts.heading },
          ]}
        >
          {name}
        </Text>
        {minPlayers && maxPlayers && (
          <Text
            style={[
              styles.meta,
              { color: colors.text, fontFamily: fonts.text },
            ]}
          >
            {minPlayers}–{maxPlayers} jugadores
          </Text>
        )}
        {playTime && (
          <Text style={[styles.meta, { color: colors.placeholder }]}>
            Duración: {playTime} min
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {variant === "inventory" && onEdit && (
          <Pressable onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={colors.text} />
          </Pressable>
        )}
        {variant === "inventory" && onDelete && (
          <Pressable onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.text} />
          </Pressable>
        )}
        {variant === "catalog" && onAdd && (
          <Pressable onPress={onAdd}>
            <Ionicons name="add-circle-outline" size={22} color={colors.text} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
});
