from pydantic import BaseModel, UUID4, Field
from datetime import date
from typing import List


class Tournament(BaseModel):
    id: UUID4
    start_date: date
    status: str
    rounds_count: int
    rounds: List["Round"] = Field(..., default_factory=list)

    class Config:
        from_attributes = True


class Round(BaseModel):
    id: UUID4
    round_number: int
    tournament_id: UUID4
    matches: List["Match"] = Field(..., default_factory=list)

    class Config:
        from_attributes = True


class Match(BaseModel):
    id: UUID4
    round_id: UUID4
    teams: List["Team"] = Field(..., default_factory=list)
    score: int = 0  # Score is derived from teams

    class Config:
        from_attributes = True


class Team(BaseModel):
    id: UUID4
    match_id: UUID4
    players: List["Player"] = Field(..., default_factory=list)
    score: int

    class Config:
        from_attributes = True


class Player(BaseModel):
    id: UUID4
    name: str
    cumulative_score: int

    class Config:
        from_attributes = True
