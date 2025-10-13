import type {
  CreatePlayer,
  CreateTournament,
  Player,
  Tournament,
} from "@/features/shared/types";

interface MatchScorePayload {
  matchId: string;
  teamIds: string[];
  teamScores: number[];
}

const BASE_URL = "/api";

function getJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchTournaments(): Promise<Tournament[]> {
  const response = await fetch(`${BASE_URL}/tournament`);
  return getJson<Tournament[]>(response);
}

export async function createTournament(
  payload: CreateTournament
): Promise<Tournament> {
  const response = await fetch(`${BASE_URL}/tournament`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return getJson<Tournament>(response);
}

export async function deleteTournament(tournamentId: string): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/tournament/${tournamentId}/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete tournament");
  }
}

export async function fetchTournament(
  tournamentId: string
): Promise<Tournament> {
  const response = await fetch(`${BASE_URL}/tournament/${tournamentId}`);
  return getJson<Tournament>(response);
}

export async function fetchTournamentLeaderboard(
  tournamentId: string
): Promise<Player[]> {
  const response = await fetch(
    `${BASE_URL}/leaderboard/tournament/${tournamentId}`
  );

  if (response.status === 404) {
    return [];
  }

  return getJson<Player[]>(response);
}

export async function submitMatchScore({
  matchId,
  teamIds,
  teamScores,
}: MatchScorePayload): Promise<void> {
  if (teamIds.length !== 2 || teamScores.length !== 2) {
    throw new Error(
      "Invalid team structure - exactly 2 teams and scores required"
    );
  }

  const formData = new FormData();
  formData.append("match_id", matchId);
  formData.append("team1_id", teamIds[0]);
  formData.append("team2_id", teamIds[1]);
  formData.append("team1_score", String(teamScores[0]));
  formData.append("team2_score", String(teamScores[1]));

  const response = await fetch(`${BASE_URL}/score`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update scores");
  }
}

export async function registerPlayer(
  tournamentId: string,
  payload: CreatePlayer
): Promise<Player> {
  const response = await fetch(
    `${BASE_URL}/tournament/${tournamentId}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  return getJson<Player>(response);
}

export async function removePlayer(
  tournamentId: string,
  playerId: string
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/tournament/${tournamentId}/remove-player/${playerId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to remove player");
  }
}

export async function initializeTournament(
  tournamentId: string
): Promise<Tournament> {
  const response = await fetch(
    `${BASE_URL}/tournament/${tournamentId}/initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return getJson<Tournament>(response);
}

export async function resetTournament(
  tournamentId: string
): Promise<Tournament> {
  const response = await fetch(`${BASE_URL}/tournament/${tournamentId}/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return getJson<Tournament>(response);
}
