import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppTheme } from "src/styles/useAppTheme";
import { Game } from "../inventory/GameCard";

interface Props {
  visible: boolean;
  game: Game | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function GameDetailsModal({
  visible,
  game,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const { colors, fonts } = useAppTheme();

  if (!game) return null;

  const { name, description, imageUrl, minPlayers, maxPlayers, playTime } =
    game.customData;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay]}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <ScrollView>
            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            )}

            <Text
              style={[
                styles.name,
                { color: colors.text, fontFamily: fonts.heading },
              ]}
            >
              {name}
            </Text>

            {description && (
              <Text
                style={[
                  styles.description,
                  { color: colors.text, fontFamily: fonts.text },
                ]}
              >
                {description}
              </Text>
            )}

            <View style={styles.metaGroup}>
              {minPlayers && maxPlayers && (
                <Text style={[styles.meta, { color: colors.text }]}>
                  Jugadores: {minPlayers}–{maxPlayers}
                </Text>
              )}
              {playTime && (
                <Text style={[styles.meta, { color: colors.text }]}>
                  Duración: {playTime} min
                </Text>
              )}
              {game.acquisitionDate && (
                <Text style={[styles.meta, { color: colors.text }]}>
                  Adquirido:{" "}
                  {new Date(game.acquisitionDate).toLocaleDateString()}
                </Text>
              )}
              {game.notes && (
                <Text style={[styles.meta, { color: colors.placeholder }]}>
                  Notas: {game.notes}
                </Text>
              )}
            </View>

            <View style={styles.actions}>
              {onEdit && (
                <Pressable style={styles.iconButton} onPress={onEdit}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={colors.text}
                  />
                </Pressable>
              )}
              {onDelete && (
                <Pressable style={styles.iconButton} onPress={onDelete}>
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={colors.text}
                  />
                </Pressable>
              )}
              <Pressable style={styles.iconButton} onPress={onClose}>
                <Ionicons name="close-outline" size={24} color={colors.text} />
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  metaGroup: {
    gap: 6,
    marginBottom: 16,
  },
  meta: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 8,
  },
  iconButton: {
    padding: 6,
  },
});
