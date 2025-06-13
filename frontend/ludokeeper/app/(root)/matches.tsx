import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { deleteMatch, Match } from "src/api/match";
import MatchDetailsModal from "src/components/layouts/MatchDetailsModal";
import MatchFormModal from "src/components/layouts/MatchFormModal";
import MatchCard from "src/components/matches/MatchCard";
import { useMatch } from "src/hooks/useMatch";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function MatchScreen() {
  const { colors } = useAppTheme();
  const styles = useScreenStyles();
  const { token } = useAuthStore();
  const { matches, loading, error, refetch } = useMatch();
  const [selectedMatch, setSelectedMatch] = useState<null | Match>(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingMatch, setEditingMatch] = useState<null | Match>(null);

  const handleDelete = async (match: Match) => {
    let confirmed = true;

    if (Platform.OS === "web") {
      confirmed = window.confirm("¿Seguro que quieres eliminar esta partida?");
    } else {
      confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert("Eliminar partida", "¿Seguro que quieres eliminarla?", [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => resolve(true),
          },
        ]);
      });
    }

    if (!confirmed) return;

    try {
      await deleteMatch(token!, match._id);
      await refetch();
    } catch (err) {
      console.error("Error al eliminar partida:", err);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Text style={styles.loadingText}>Cargando partidas...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && matches.length === 0 && (
        <Text style={styles.emptyText}>No hay partidas registradas</Text>
      )}

      <ScrollView>
        {Array.isArray(matches) &&
          matches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              onPress={() => setSelectedMatch(match)}
              onEdit={() => {
                setEditingMatch(match);
                setFormVisible(true);
              }}
              onDelete={() => handleDelete(match)}
            />
          ))}
      </ScrollView>

      <Pressable
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: colors.primary,
          padding: 16,
          borderRadius: 100,
          elevation: 5,
        }}
        onPress={() => {
          setEditingMatch(null);
          setFormVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </Pressable>

      <MatchDetailsModal
        visible={!!selectedMatch}
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onEdit={() => {
          if (selectedMatch) {
            setEditingMatch(selectedMatch);
            setFormVisible(true);
            setSelectedMatch(null);
          }
        }}
        onDelete={() => selectedMatch && handleDelete(selectedMatch)}
      />

      <MatchFormModal
        visible={isFormVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingMatch(null);
        }}
        onSuccess={async () => {
          setFormVisible(false);
          setEditingMatch(null);
          refetch();
        }}
        initialData={editingMatch}
      />
    </View>
  );
}
