// containers/TournamentsContainer.tsx
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import type { Tournament } from "@/types/types";
import TournamentsList from "@/components/TournamentsList";

export default function TournamentsContainer() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="xl" />;

  return <TournamentsList tournaments={tournaments} />;
}
