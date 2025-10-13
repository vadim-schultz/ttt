import { LoadingState } from "@/shared/ui";
import { ErrorState } from "@/shared/error";
import { useTournaments } from "../hooks/useTournaments";
import TournamentsView from "../components/TournamentsView";
import { useTournamentsHandlers } from "../services/tournamentsHandlers";

export default function TournamentsContainer() {
  const { tournaments, loading, error, creationStatus, isCreating, actions } =
    useTournaments();

  const {
    showCreateForm,
    toggleCreateForm,
    handleCreateTournament,
    handleDeleteTournament,
    handleClearCreationStatus,
  } = useTournamentsHandlers({
    actions,
    creationStatus,
  });

  if (loading) {
    return <LoadingState message="Loading tournaments..." />;
  }

  if (error) {
    return (
      <ErrorState
        layout="card"
        title="Couldn't load tournaments"
        message={error}
        onAction={actions.refresh}
      />
    );
  }

  return (
    <TournamentsView
      tournaments={tournaments}
      onDeleteTournament={handleDeleteTournament}
      showCreateForm={showCreateForm}
      onToggleCreateForm={toggleCreateForm}
      onCreateTournament={handleCreateTournament}
      creationStatus={creationStatus}
      clearCreationStatus={handleClearCreationStatus}
      isCreating={isCreating}
    />
  );
}
