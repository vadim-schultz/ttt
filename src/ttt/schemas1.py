from uuid import UUID, uuid4
from datetime import date
from pydantic import BaseModel, Field, field_serializer, conint, model_validator
from typing import List, Literal


class Player(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=2, max_length=50, description="Player's name")
    score: conint(ge=0, le=4) = 0  
    class Config:
        from_attributes = True


class Team(BaseModel):
    match_id: UUID = Field(default_factory=uuid4)
    players: List[Player]

    @field_serializer("match_id")
    def serialize_uuid(self, match_id):
        return str(match_id)

    @model_validator(mode="before")
    @classmethod
    def check_players(cls, values):
        players = values.get("players", [])
        if len(players) not in [1, 2]:
            raise ValueError("Teams must have either 1 player (Singles) or 2 players (Doubles).")
        return values

    class Config:
        from_attributes = True  


class Game(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    round_id: UUID
    match_type: Literal["Singles", "Doubles"]
    team_a: Team
    team_b: Team
    score: str = Field("0 : 0", description="Default score at the start")  

    @model_validator(mode="before")
    @classmethod
    def validate_match(cls, values):
        """Master validator that calls all individual checks"""
        cls.validate_team_size(values)
        cls.validate_distinct_teams(values)
        cls.validate_score_format(values)
        cls.validate_total_score(values)
        cls.validate_no_ties(values)
        return values

    @staticmethod
    def validate_team_size(values):
        """Ensure the correct team size based on the match type."""
        match_type = values["match_type"]
        team_a = values["team_a"]
        team_b = values["team_b"]
        expected_players = 1 if match_type == "Singles" else 2

        if len(team_a.players) != expected_players or len(team_b.players) != expected_players:
            raise ValueError(f"For {match_type}, teams must have {expected_players} player(s).")

    @staticmethod
    def validate_distinct_teams(values):
        """Ensure a player is not in both teams."""
        team_a = values["team_a"]
        team_b = values["team_b"]

        players_a = {player.id for player in team_a.players}
        players_b = {player.id for player in team_b.players}

        if players_a & players_b:
            raise ValueError("A player cannot be in both teams in the same game.")

    @staticmethod
    def validate_score_format(values):
        """Ensure score is correctly formatted as 'X : Y'."""
        score = values["score"]
        try:
            score_a, score_b = map(int, score.split(" : "))
        except ValueError:
            raise ValueError("Score must be in the format 'X : Y', where X and Y are integers.")

    @staticmethod
    def validate_total_score(values):
        """Ensure total score equals 4 or 0 (if not started)."""
        score_a, score_b = map(int, values["score"].split(" : "))
        if score_a + score_b not in [0, 4]:
            raise ValueError("Total game score must be 4 (or 0 if not started).")

    @staticmethod
    def validate_no_ties(values):
        """Ensure there is a clear winner (no ties)."""
        score_a, score_b = map(int, values["score"].split(" : "))
        if score_a == score_b and score_a > 0:
            raise ValueError("A game must have a winner (No ties allowed).")

    class Config:
        from_attributes = True  


class Round(BaseModel):
    tournament_id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., description="Round name (Quarter-finals, Semi-finals, Finals)")
    rounds: List[Game]
    round_number: int = Field(..., ge=0, le=10,description="Round number must be between 1 and 10.")

    @field_serializer("tournament_id")
    def serialize_uuid(self, tournament_id):
        return str(tournament_id)

    class Config:
        from_attributes = True  

class Match(BaseModel):
    round_id: UUID = Field(default_factory=uuid4) # Foreign key

    @field_serializer("round_id")
    def serialize_uuid(self, round_id):
        return str(round_id)


class Tournament(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=3, max_length=100, description="Tournament name")
    rounds: List[Round]
    start_date: date
    status: str = "ongoing"
    rounds_count: int

    @model_validator(mode="before")
    @classmethod
    def validate_start_date(cls, values):
        if values["start_date"] < date.today():
            raise ValueError("Tournament start date cannot be in the past.")
        return values
    

    class Config:
        from_attributes = True  
