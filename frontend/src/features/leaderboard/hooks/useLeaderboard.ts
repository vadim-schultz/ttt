import { useCallback, useEffect, useState } from "react";
import type { Player } from "@/types/types";
import { fetchLeaderboard } from "../services/leaderboardApi";

interface UseLeaderboardResult {
  players: Player[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export default function useLeaderboard(): UseLeaderboardResult {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLeaderboard();
      setPlayers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    players,
    loading,
    error,
    refresh: loadLeaderboard,
  };
}
