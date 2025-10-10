import { useCallback, useEffect, useState } from "react";
import type {
  CreatePlayer,
  MatchScore,
  Player,
  Tournament,
} from "@/types/types";
import type { StatusMessage } from "@/features/shared/types/status";
import {
  fetchTournament,
  fetchTournamentLeaderboard,
  initializeTournament,
  registerPlayer,
  removePlayer,
  resetTournament,
  submitMatchScore,
} from "../services/tournamentApi";

interface UseTournamentResult {
  tournament: Tournament | null;
  leaderboard: Player[];
  loading: boolean;
  error: string | null;
  leaderboardError: string | null;
  registrationStatus: StatusMessage | null;
  initializerStatus: StatusMessage | null;
  resetStatus: StatusMessage | null;
  actions: {
    refresh: () => Promise<void>;
    submitScore: (payload: MatchScore) => Promise<void>;
    registerPlayer: (data: CreatePlayer) => Promise<void>;
    removePlayer: (playerId: string) => Promise<void>;
    initialize: () => Promise<void>;
    reset: () => Promise<void>;
    clearRegistrationStatus: () => void;
    clearInitializerStatus: () => void;
    clearResetStatus: () => void;
  };
}

export function useTournament(tournamentId?: string): UseTournamentResult {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] =
    useState<StatusMessage | null>(null);
  const [initializerStatus, setInitializerStatus] =
    useState<StatusMessage | null>(null);
  const [resetStatus, setResetStatus] = useState<StatusMessage | null>(null);

  const refresh = useCallback(async () => {
    if (!tournamentId) {
      setTournament(null);
      setLeaderboard([]);
      setError("Tournament ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tournamentData = await fetchTournament(tournamentId);
      setTournament(tournamentData);

      try {
        const leaderboardData = await fetchTournamentLeaderboard(tournamentId);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLeaderboardError(null);
      } catch (leaderboardProblem) {
        console.warn("Unable to load leaderboard:", leaderboardProblem);
        setLeaderboard([]);
        setLeaderboardError(
          leaderboardProblem instanceof Error
            ? leaderboardProblem.message
            : "Leaderboard could not be loaded. Please try again later."
        );
      }
    } catch (requestError) {
      console.error("Failed to fetch tournament data:", requestError);
      setTournament(null);
      setLeaderboard([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load tournament data."
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  const submitScore = useCallback(
    async ({ match_id, team_ids, team_scores }: MatchScore) => {
      if (!tournamentId) {
        throw new Error("Tournament ID is missing.");
      }

      await submitMatchScore({
        matchId: match_id,
        teamIds: team_ids,
        teamScores: team_scores,
      });

      await refresh();
    },
    [refresh, tournamentId]
  );

  const handlePlayerRegistration = useCallback(
    async (data: CreatePlayer) => {
      if (!tournamentId) {
        throw new Error("Tournament ID is missing.");
      }

      try {
        const player = await registerPlayer(tournamentId, data);
        setRegistrationStatus({
          type: "success",
          text: `Player "${player.name}" has been registered successfully.`,
        });
        setTournament((prev: Tournament | null) =>
          prev
            ? {
                ...prev,
                registered_players: [
                  ...(prev.registered_players || []),
                  player,
                ],
              }
            : prev
        );
      } catch (registrationError) {
        console.error("Error registering player:", registrationError);
        setRegistrationStatus({
          type: "error",
          text:
            registrationError instanceof Error
              ? registrationError.message
              : "Failed to register player. Please try again.",
        });
        throw registrationError;
      }
    },
    [tournamentId]
  );

  const handlePlayerRemoval = useCallback(
    async (playerId: string) => {
      if (!tournamentId) {
        throw new Error("Tournament ID is missing.");
      }

      await removePlayer(tournamentId, playerId);
      await refresh();
    },
    [refresh, tournamentId]
  );

  const handleInitialize = useCallback(async () => {
    if (!tournamentId) {
      throw new Error("Tournament ID is missing.");
    }

    try {
      const updatedTournament = await initializeTournament(tournamentId);
      setTournament(updatedTournament);
      setInitializerStatus({
        type: "success",
        text: `Tournament initialized successfully with ${updatedTournament.rounds_count} rounds!`,
      });
    } catch (initializeError) {
      console.error("Failed to initialize tournament:", initializeError);
      setInitializerStatus({
        type: "error",
        text:
          initializeError instanceof Error
            ? initializeError.message
            : "Failed to initialize tournament. Please try again.",
      });
      throw initializeError;
    }
  }, [tournamentId]);

  const handleReset = useCallback(async () => {
    if (!tournamentId) {
      throw new Error("Tournament ID is missing.");
    }

    try {
      const updatedTournament = await resetTournament(tournamentId);
      setTournament(updatedTournament);
      setResetStatus({
        type: "success",
        text: `Tournament "${updatedTournament.name}" has been reset successfully!`,
      });
    } catch (resetError) {
      console.error("Failed to reset tournament:", resetError);
      setResetStatus({
        type: "error",
        text:
          resetError instanceof Error
            ? resetError.message
            : "Failed to reset tournament. Please try again.",
      });
      throw resetError;
    }
  }, [tournamentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    tournament,
    leaderboard,
    loading,
    error,
    leaderboardError,
    registrationStatus,
    initializerStatus,
    resetStatus,
    actions: {
      refresh,
      submitScore,
      registerPlayer: handlePlayerRegistration,
      removePlayer: handlePlayerRemoval,
      initialize: handleInitialize,
      reset: handleReset,
      clearRegistrationStatus: () => setRegistrationStatus(null),
      clearInitializerStatus: () => setInitializerStatus(null),
      clearResetStatus: () => setResetStatus(null),
    },
  };
}
