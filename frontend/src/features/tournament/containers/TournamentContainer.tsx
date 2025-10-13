import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingState from "@/components/ui/LoadingState";
import { ErrorState } from "@/shared/ui/error";
import { useTournament } from "../hooks/useTournament";
import TournamentNotFound from "../components/TournamentNotFound";
import TournamentView from "../components/TournamentView";
import { useTournamentHandlers } from "../services/tournamentHandlers";

export default function TournamentContainer() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const {
    tournament,
    leaderboard,
    loading,
    error,
    leaderboardError,
    registrationStatus,
    initializerStatus,
    resetStatus,
    actions,
  } = useTournament(tournamentId);

  const {
    handleScoreUpdate,
    handlePlayerRegistration,
    handlePlayerRemoved,
    handleInitialize,
    handleReset,
  } = useTournamentHandlers({
    actions,
    setIsRegistering,
    setIsInitializing,
    setIsResetting,
  });

  if (loading) {
    return <LoadingState message="Loading tournament..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load tournament"
        message={error ?? "Failed to load tournament."}
        onAction={actions.refresh}
      />
    );
  }

  if (!tournament) {
    return <TournamentNotFound />;
  }

  return (
    <TournamentView
      tournament={tournament}
      leaderboard={leaderboard}
      leaderboardError={leaderboardError}
      onBack={() => navigate("/")}
      onScoreUpdate={handleScoreUpdate}
      onPlayerRegistration={handlePlayerRegistration}
      onPlayerRemoved={handlePlayerRemoved}
      onInitialize={handleInitialize}
      onReset={handleReset}
      registrationStatus={registrationStatus}
      initializerStatus={initializerStatus}
      resetStatus={resetStatus}
      clearRegistrationStatus={actions.clearRegistrationStatus}
      clearInitializerStatus={actions.clearInitializerStatus}
      clearResetStatus={actions.clearResetStatus}
      isRegistering={isRegistering}
      isInitializing={isInitializing}
      isResetting={isResetting}
    />
  );
}
