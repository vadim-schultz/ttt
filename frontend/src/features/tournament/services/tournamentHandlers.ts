import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CreatePlayer } from "@/features/shared/types";
import type { useTournament } from "../hooks/useTournament";

export type TournamentActions = ReturnType<typeof useTournament>["actions"];

interface UseTournamentHandlersParams {
  actions: TournamentActions;
  setIsRegistering: Dispatch<SetStateAction<boolean>>;
  setIsInitializing: Dispatch<SetStateAction<boolean>>;
  setIsResetting: Dispatch<SetStateAction<boolean>>;
}

export function useTournamentHandlers({
  actions,
  setIsRegistering,
  setIsInitializing,
  setIsResetting,
}: UseTournamentHandlersParams) {
  const handleScoreUpdate = useCallback(
    async (matchId: string, teamScores: number[], teamIds: string[]) => {
      await actions.submitScore({
        match_id: matchId,
        team_ids: teamIds,
        team_scores: teamScores,
      });
    },
    [actions]
  );

  const handlePlayerRegistration = useCallback(
    async (data: CreatePlayer) => {
      setIsRegistering(true);
      try {
        await actions.registerPlayer(data);
      } finally {
        setIsRegistering(false);
      }
    },
    [actions, setIsRegistering]
  );

  const handlePlayerRemoved = useCallback(
    async (playerId: string) => {
      await actions.removePlayer(playerId);
    },
    [actions]
  );

  const handleInitialize = useCallback(async () => {
    setIsInitializing(true);
    try {
      await actions.initialize();
    } finally {
      setIsInitializing(false);
    }
  }, [actions, setIsInitializing]);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      await actions.reset();
    } finally {
      setIsResetting(false);
    }
  }, [actions, setIsResetting]);

  return {
    handleScoreUpdate,
    handlePlayerRegistration,
    handlePlayerRemoved,
    handleInitialize,
    handleReset,
  };
}
