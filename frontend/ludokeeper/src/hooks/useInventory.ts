import { useCallback, useEffect, useState } from "react";
import { getUserGames } from "src/api/inventory";
import { Game } from "src/components/games/GameCard";
import { useAuthStore } from "src/store/authStore";

interface Filters {
  name?: string;
  category?: string;
  mechanic?: string;
  year?: string;
  minPlayers?: string;
  maxPlayers?: string;
  source?: string;
}

export const useInventory = () => {
  const token = useAuthStore((state) => state.token);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);
    return () => clearTimeout(timeout);
  }, [filters]);

  // Fetch
  const fetchGames = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const filtered = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => v),
      );
      const data = await getUserGames(token, filtered);
      setGames(data);
    } catch (err: any) {
      setError("Error al cargar juegos: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedFilters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchGames,
  };
};
