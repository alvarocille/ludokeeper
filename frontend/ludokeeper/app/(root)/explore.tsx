import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { CatalogGame, getCatalogGames } from "src/api/catalog";
import { addGame } from "src/api/inventory";
import GameCard, { Game } from "src/components/games/GameCard";
import SearchAndFilterBar from "src/components/games/SearchAndFilterBar";
import { useAuthStore } from "src/store/authStore";
import { useAppTheme } from "src/styles/useAppTheme";
import { useScreenStyles } from "src/styles/useScreenStyles";

// Adaptador para usar GameCard con juegos del catálogo
function mapCatalogToGameCard(game: CatalogGame): Game {
  return {
    _id: game._id,
    userId: "",
    source: "catalog",
    customData: {
      name: game.name,
      description: game.description,
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      playTime: game.playTime,
      imageUrl: game.imageUrl,
    },
  };
}

export default function ExploreScreen() {
  const { token } = useAuthStore();
  const { colors } = useAppTheme();
  const styles = useScreenStyles();

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [games, setGames] = useState<CatalogGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const fetchGames = async () => {
  setLoading(true);
  console.log("Llamando a getCatalogGames con filtros:", filters);
  try {
    const data = await getCatalogGames(token!, filters);
    console.log("Datos recibidos:", data);
    setGames(data);
    setError("");
  } catch (err) {
    console.error("Error en fetchGames:", err);
    setError("No se pudieron cargar los juegos.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchGames();
  }, [filters]);

  const handleAdd = async (game: CatalogGame) => {
    let confirmed = true;

    if (Platform.OS === "web") {
      confirmed = window.confirm("¿Quieres añadir este juego a tu inventario?");
    } else {
      confirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "Añadir juego",
          "¿Deseas añadir este juego a tu inventario?",
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => resolve(false),
            },
            { text: "Añadir", onPress: () => resolve(true) },
          ]
        );
      });
    }

    if (!confirmed) return;

    try {
      console.log("Añadiendo juego con ID:", game._id);
      await addGame(token!, { source: "catalog", gameId: game._id });
      await fetchGames(); // Refrescar la lista de juegos después de añadir
      Alert.alert("Añadido", "Juego añadido correctamente al inventario.");
    } catch (err) {
      console.error("Error al añadir:", err);
      Alert.alert("Error", "No se pudo añadir el juego al inventario.");
    }
  };

  return (
    <View style={styles.container}>
      <SearchAndFilterBar
        variant="catalog"
        filters={filters}
        onChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
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
            variant="catalog"
            game={mapCatalogToGameCard(game)}
            onPress={() => {}}
            onAdd={() => handleAdd(game)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
