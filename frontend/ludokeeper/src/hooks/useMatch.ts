import { useCallback, useEffect, useState } from 'react';
import { Match, getMatches } from 'src/api/match';
import { useAuthStore } from 'src/store/authStore';

export function useMatch() {
  const { token } = useAuthStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const fetchMatches = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await getMatches(token);
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar las partidas');
      console.error('useMatch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchMatches,
  };
}
