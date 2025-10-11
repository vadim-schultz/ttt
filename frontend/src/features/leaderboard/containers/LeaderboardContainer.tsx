import useLeaderboard from "../hooks/useLeaderboard";
import LeaderboardContent from "../components/LeaderboardContent";
import LeaderboardEmptyState from "../components/LeaderboardEmptyState";
import LeaderboardError from "../components/LeaderboardError";
import LeaderboardLoading from "../components/LeaderboardLoading";
import LeaderboardTable from "../components/LeaderboardTable";

export default function LeaderboardContainer() {
  const { players, loading, error } = useLeaderboard();

  const view = (() => {
    switch (true) {
      case loading:
        return <LeaderboardLoading />;
      case Boolean(error):
        return <LeaderboardError message={error ?? null} />;
      default: {
        const leaderboardView =
          players.length === 0 ? (
            <LeaderboardEmptyState />
          ) : (
            <LeaderboardTable players={players} />
          );

        return (
          <LeaderboardContent
            players={players}
            leaderboardView={leaderboardView}
          />
        );
      }
    }
  })();

  return view;
}
