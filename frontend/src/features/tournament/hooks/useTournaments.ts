import { useCallback, useEffect, useState } from "react";
import type {
  CreateTournament,
  Tournament,
  StatusMessage,
} from "@/features/shared/types";
import {
  createTournament,
  deleteTournament,
  fetchTournaments,
} from "../services/tournamentApi";

interface UseTournamentsResult {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
  creationStatus: StatusMessage | null;
  isCreating: boolean;
  actions: {
    refresh: () => Promise<void>;
    create: (payload: CreateTournament) => Promise<void>;
    delete: (tournamentId: string) => Promise<void>;
    clearCreationStatus: () => void;
  };
}

export function useTournaments(): UseTournamentsResult {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creationStatus, setCreationStatus] = useState<StatusMessage | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTournaments();
      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format from server");
      }
      setTournaments(data);
    } catch (requestError) {
      console.error("Error fetching tournaments:", requestError);
      setTournaments([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load tournaments"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = useCallback(async (payload: CreateTournament) => {
    setIsCreating(true);
    setCreationStatus(null);
    try {
      const tournament = await createTournament(payload);
      setTournaments((prev: Tournament[]) => [tournament, ...prev]);
      setCreationStatus({
        type: "success",
        text: `Tournament "${tournament.name}" has been created successfully.`,
      });
    } catch (createError) {
      console.error("Failed to create tournament:", createError);
      setCreationStatus({
        type: "error",
        text: "Failed to create tournament. Please try again.",
      });
      throw createError;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const handleDelete = useCallback(async (tournamentId: string) => {
    await deleteTournament(tournamentId);
    setTournaments((prev: Tournament[]) =>
      prev.filter((tournament: Tournament) => tournament.id !== tournamentId)
    );
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    tournaments,
    loading,
    error,
    creationStatus,
    isCreating,
    actions: {
      refresh,
      create: handleCreate,
      delete: handleDelete,
      clearCreationStatus: () => setCreationStatus(null),
    },
  };
}
