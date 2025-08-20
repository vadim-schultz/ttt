import { useEffect, useState } from "react";
import { Spinner, Alert } from "@chakra-ui/react";
import type { Player } from "@/types/types";
import LeaderboardTable from "@/components/LeaderboardTable";

export default function LeaderboardContainer() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        return res.json();
      })
      .then((data) => setPlayers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="xl" />;
  if (error) return (
    <Alert.Root status="error">{error}</Alert.Root>
  );

  return <LeaderboardTable players={players} />;
}
