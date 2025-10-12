import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const TournamentsPage = lazy(
  () => import("./features/tournament/containers/TournamentsContainer")
);
const TournamentPage = lazy(
  () => import("./features/tournament/containers/TournamentContainer")
);
const LeaderboardPage = lazy(
  () => import("./features/leaderboard/containers/LeaderboardContainer")
);
const ScorePage = lazy(
  () => import("./features/score/containers/ScoreContainer")
);

function AppFallback() {
  return <div>Loading...</div>;
}

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<AppFallback />}>
        <Routes>
          <Route path="/" element={<TournamentsPage />} />
          <Route
            path="/tournament/:tournamentId"
            element={<TournamentPage />}
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/score/:matchId" element={<ScorePage />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
