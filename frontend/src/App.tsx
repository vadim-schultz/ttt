import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Containers / pages
import {
  TournamentsContainer as TournamentsPage,
  TournamentContainer as TournamentPage,
} from "./features/tournament";
import { LeaderboardContainer as LeaderboardPage } from "./features/leaderboard";
import { ScoreContainer as ScorePage } from "./features/score";

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
