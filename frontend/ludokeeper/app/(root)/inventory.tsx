import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { deleteGame } from "src/api/inventory";
import GameCard, { Game } from "src/components/games/GameCard";
import SearchAndFilterBar from "src/components/games/SearchAndFilterBar";
import GameDetailsModal from "src/components/layouts/GameDetailsModal";
import GameFormModal from "src/components/layouts/GameFormModal";
import { useInventory } from "src/hooks/useInventory";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

export default function InventoryScreen() {
  const { colors } = useAppTheme();
  const styles = useScreenStyles();
  const { token } = useAuthStore();
  const { games, filters, setFilters, loading, error, refetch } =
    useInventory();
  const [selectedGame, setSelectedGame] = useState<null | Game>(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingGame, setEditingGame] = useState<null | Game>(null);

  const handleDelete = async (game: Game) => {
    let confirmed = true;

    if (Platform.OS === "web") {
      confirmed = window.confirm("¿Seguro que quieres eliminar este juego?");
    } else {
      confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert("Eliminar juego", "¿Seguro que quieres eliminarlo?", [
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
      await deleteGame(token!, game._id);
      await refetch();
    } catch (err) {
      console.error("Error al eliminar juego:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  return (
    <View style={styles.container}>
      <SearchAndFilterBar
        filters={filters}
        onChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        variant={"inventory"}
      />

      {loading && <Text style={styles.loadingText}>Cargando juegos...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && games.length === 0 && (
        <Text style={styles.emptyText}>No hay juegos que coincidan</Text>
      )}

      <ScrollView>
        {games.map((game) => (
          <GameCard
            key={game._id}
            game={game}
            onPress={() => setSelectedGame(game)}
            onEdit={() => {
              setEditingGame(game);
              setFormVisible(true);
            }}
            onDelete={() => handleDelete(game)}
            variant={"inventory"}
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
          setEditingGame(null);
          setFormVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color={colors.background} />
      </Pressable>

      <GameDetailsModal
        visible={!!selectedGame}
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onEdit={() => {
          if (selectedGame) {
            setEditingGame(selectedGame);
            setFormVisible(true);
            setSelectedGame(null);
          }
        }}
        onDelete={() => selectedGame && handleDelete(selectedGame)}
      />

      <GameFormModal
        visible={isFormVisible}
        onClose={() => {
          setFormVisible(false);
          setEditingGame(null);
        }}
        onSuccess={async () => {
          setFormVisible(false);
          setEditingGame(null);
          refetch();
        }}
        initialData={editingGame}
      />
    </View>
  );
}
