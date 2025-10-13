import type { ScoreFormValues } from "../types/forms";

const SCORE_ENDPOINT = "/api/score";

export async function submitScore(values: ScoreFormValues): Promise<void> {
  const formData = new FormData();
  formData.append("match_id", values.matchId);
  formData.append("team1_id", values.team1Id);
  formData.append("team1_score", values.team1Score.toString());
  formData.append("team2_id", values.team2Id);
  formData.append("team2_score", values.team2Score.toString());

  const response = await fetch(SCORE_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update score");
  }
}
