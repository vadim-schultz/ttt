from app.repositories.score_repository import ScoreRepository
import app.models as models

class ScoreService:
    def __init__(self, repo: ScoreRepository):
        self.repo = repo

    async def update_score(self, form_data) -> dict[str, str]:
        try:
            match_score = models.read.MatchScore(
                match_id=form_data["match_id"],
                team_ids=[form_data["team1_id"], form_data["team2_id"]],
                team_scores=[int(form_data["team1_score"]), int(form_data["team2_score"])],
            )
            match = self.repo.get_match(match_score.match_id)
            if not match:
                return {"error": "Match not found", "status": "error"}
            teams = self.repo.get_teams_in_match(match_score.team_ids, match_score.match_id)
            if len(teams) != 2:
                return {"error": "Invalid teams", "status": "error"}
            team_map = {team.id: team for team in teams}
            for team_id, new_score in zip(match_score.team_ids, match_score.team_scores):
                if team_id in team_map:
                    team_map[team_id].score = new_score
                else:
                    return {"error": f"Team {team_id} not found in match", "status": "error"}
            self.repo.commit()
            return {"message": "Score updated successfully", "status": "success"}
        except Exception as e:
            self.repo.rollback()
            return {"error": f"Failed to update score: {str(e)}", "status": "error"}
