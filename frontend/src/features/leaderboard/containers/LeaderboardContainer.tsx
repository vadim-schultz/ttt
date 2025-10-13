import LoadingState from "@/components/ui/LoadingState";
import { ErrorState } from "@/shared/ui/error";
import useLeaderboard from "../hooks/useLeaderboard";
import LeaderboardContent from "../components/LeaderboardContent";
import LeaderboardEmptyState from "../components/LeaderboardEmptyState";
import LeaderboardTable from "../components/LeaderboardTable";

export default function LeaderboardContainer() {
  const { players, loading, error } = useLeaderboard();

  if (loading) {
    return <LoadingState message="Loading leaderboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        layout="alert"
        title="Error Loading Leaderboard"
        message={error}
      />
    );
  }

  const leaderboardView =
    players.length === 0 ? (
      <LeaderboardEmptyState />
    ) : (
      <LeaderboardTable players={players} />
    );

  return (
    <LeaderboardContent players={players} leaderboardView={leaderboardView} />
  );
}
