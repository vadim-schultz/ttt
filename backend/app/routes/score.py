from litestar import Request, post
from litestar.di import Provide
from sqlalchemy.orm import Session

import app.models as models
import app.schemas.orm as orm
from app.services.db import get_db_session


@post("/score", dependencies={"db": Provide(get_db_session)})
async def update_score(request: Request, db: Session) -> dict[str, str]:
    """Updates team scores for a given match and returns JSON response."""
    try:
        form_data = await request.form()
        match_score = models.read.MatchScore(
            match_id=form_data["match_id"],
            team_ids=[form_data["team1_id"], form_data["team2_id"]],
            team_scores=[int(form_data["team1_score"]), int(form_data["team2_score"])],
        )

        match = db.query(orm.Match).filter(orm.Match.id == match_score.match_id).first()

        if not match:
            return {"error": "Match not found", "status": "error"}

        # Ensure both team IDs exist in the match
        teams = (
            db.query(orm.Team)
            .filter(orm.Team.id.in_(match_score.team_ids), orm.Team.match_id == match_score.match_id)
            .all()
        )
        if len(teams) != 2:
            return {"error": "Invalid teams", "status": "error"}

        # Create a mapping of team ID to team object
        team_map = {team.id: team for team in teams}

        # Update scores in the correct order by matching team IDs
        for team_id, new_score in zip(match_score.team_ids, match_score.team_scores):
            if team_id in team_map:
                team_map[team_id].score = new_score  # Overwrite score
            else:
                return {"error": f"Team {team_id} not found in match", "status": "error"}

        db.commit()  # Save changes
        return {"message": "Score updated successfully", "status": "success"}

    except Exception as e:
        db.rollback()
        return {"error": f"Failed to update score: {str(e)}", "status": "error"}
