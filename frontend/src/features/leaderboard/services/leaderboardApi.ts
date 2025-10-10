import type { Player } from "@/types/types";

const LEADERBOARD_ENDPOINT = "/api/leaderboard";

export async function fetchLeaderboard(): Promise<Player[]> {
  const response = await fetch(LEADERBOARD_ENDPOINT);

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  const data = await response.json();
  return data as Player[];
}
