// containers/TournamentContainer.tsx
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import type { Tournament } from "@/types/types";
import TournamentDetail from "@/components/TournamentCard";

export default function TournamentContainer() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tournament/${tournamentId}`)
      .then((res) => res.json())
      .then((data) => setTournament(data))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  if (loading) return <Spinner size="xl" />;
  if (!tournament) return <p>Tournament not found</p>;

  return <TournamentDetail tournament={tournament} />;
}
