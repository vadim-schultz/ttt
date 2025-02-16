from typing import List

from pydantic import BaseModel, UUID4


class TeamScore(BaseModel):
    match_id: UUID4
    team_scores: List[int]