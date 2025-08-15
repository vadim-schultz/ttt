from litestar import Request, post
from litestar.di import Provide
from litestar.response import Redirect
from sqlalchemy.orm import Session

import app.models as models
import app.schemas.orm as orm
from app.services.db import get_db_session


@post("/score", dependencies={"db": Provide(get_db_session)})
async def update_score(request: Request, db: Session) -> Redirect:
    """Updates team scores for a given match and redirects back to the tournament page."""
    form_data = await request.form()
    match_score = models.read.MatchScore(
        match_id=form_data["match_id"],
        team_ids=[form_data["team1_id"], form_data["team2_id"]],
        team_scores=[form_data["team1_score"], form_data["team2_score"]],
    )

    match = db.query(orm.Match).filter(orm.Match.id == match_score.match_id).first()

    if not match:
        return Redirect("/leaderboard/?error=Match not found")

    # Ensure both team IDs exist in the match
    teams = (
        db.query(orm.Team)
        .filter(orm.Team.id.in_(match_score.team_ids), orm.Team.match_id == match_score.match_id)
        .all()
    )
    if len(teams) != 2:
        return Redirect("/leaderboard/?error=Invalid teams")

    # Update scores
    for team, new_score in zip(teams, match_score.team_scores):
        team.score = new_score  # Overwrite score

    db.commit()  # Save changes
    return Redirect("/leaderboard/?success=Score updated")
