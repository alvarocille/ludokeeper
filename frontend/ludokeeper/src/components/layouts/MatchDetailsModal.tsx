import { Match } from "src/api/match";
import { useAppTheme } from "src/styles/useAppTheme";
import { format } from "date-fns";
import { Pencil, Trash2, X } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface Props {
  visible: boolean;
  match: Match | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MatchDetailsModal({
  visible,
  match,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const { colors } = useAppTheme();

  if (!match) return null;

  const formattedDate = format(new Date(match.date), "dd/MM/yyyy HH:mm");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#00000088",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            maxHeight: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.primary,
              }}
            >
              Detalles de la partida
            </Text>
            <Pressable onPress={onClose}>
              <X size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView>
            <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
              Fecha: {formattedDate}
            </Text>
            <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
              Duración: {match.durationMinutes} minutos
            </Text>

            <Text style={{ color: colors.text, fontSize: 16, marginBottom: 4 }}>
              Jugadores:
            </Text>
            {match.players.map((player, index) => (
              <Text
                key={index}
                style={{ color: colors.text, fontSize: 14, marginLeft: 8 }}
              >
                - {player.name}: {player.score} puntos
              </Text>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 16,
              gap: 20,
            }}
          >
            {onEdit && (
              <Pressable onPress={onEdit}>
                <Pencil size={20} color={colors.primary} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable onPress={onDelete}>
                <Trash2 size={20} color={colors.error ?? "#cc0000"} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
