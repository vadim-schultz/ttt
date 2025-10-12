import { useCallback, useState } from "react";
import type { CreateTournament, StatusMessage } from "@/features/shared/types";

type TournamentsActions = {
  refresh: () => Promise<void>;
  create: (payload: CreateTournament) => Promise<void>;
  delete: (tournamentId: string) => Promise<void>;
  clearCreationStatus: () => void;
};

interface UseTournamentsHandlersParams {
  actions: TournamentsActions;
  creationStatus: StatusMessage | null;
}

interface UseTournamentsHandlersResult {
  showCreateForm: boolean;
  toggleCreateForm: () => void;
  handleCreateTournament: (payload: CreateTournament) => Promise<void>;
  handleDeleteTournament: (tournamentId: string) => Promise<void>;
  handleClearCreationStatus: () => void;
}

export function useTournamentsHandlers({
  actions,
  creationStatus,
}: UseTournamentsHandlersParams): UseTournamentsHandlersResult {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateForm = useCallback(() => {
    if (creationStatus) {
      actions.clearCreationStatus();
    }
    setShowCreateForm((value: boolean) => !value);
  }, [actions, creationStatus]);

  const handleCreateTournament = useCallback(
    async (payload: CreateTournament) => {
      await actions.create(payload);
    },
    [actions]
  );

  const handleDeleteTournament = useCallback(
    async (tournamentId: string) => {
      await actions.delete(tournamentId);
    },
    [actions]
  );

  const handleClearCreationStatus = useCallback(() => {
    actions.clearCreationStatus();
  }, [actions]);

  return {
    showCreateForm,
    toggleCreateForm,
    handleCreateTournament,
    handleDeleteTournament,
    handleClearCreationStatus,
  };
}
