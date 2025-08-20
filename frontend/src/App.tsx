import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Containers / pages
import TournamentsPage from "./containers/TournamentsContainer";
import TournamentPage from "./containers/TournamentContainer";
import LeaderboardPage from "./containers/LeaderboardContainer";
import ScorePage from "./containers/ScoreContainer";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TournamentsPage />} />
        <Route path="/tournament/:tournamentId" element={<TournamentPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/score/:matchId" element={<ScorePage />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
