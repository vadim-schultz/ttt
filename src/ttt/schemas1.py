from uuid import UUID, uuid4
from datetime import date
from pydantic import BaseModel, Field, ConfigDict, field_serializer, conint, model_validator, field_validator
from typing import List, Literal
from datetime import date as DateType, time as TimeType



class Player(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=2, max_length=50, description="Player's name")
    score: conint(ge=0, le=4) = 0  

    __config__: ConfigDict = {
        'from_attributes': True,
    }


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
        if not (1 <= len(players) <= 2 ):
            raise ValueError("Teams must have either 1 player (Singles) or 2 players (Doubles).")
        return values

    __config__: ConfigDict = {
        'from_attributes': True,
    }


class Game(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    round_id: UUID
    teams: List[Team]    
    score: str = Field("0 : 0", description="Default score at the start")  
    date: DateType = Field(..., description="Date of the Game")
    time: TimeType = Field(..., description="Date of the Game")
    location: str = Field(..., min_length=3, max_length=100, description="Location of the game")  



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

    @field_validator("teams")
    def validate_team_size(values):
        """Ensure the correct team size based on the match type."""
        match_type = values["match_type"]
        teams = values["teams"]
        expected_players = 1 if match_type == "Singles" else 2

        for team in teams:
            if len(team.players) != expected_players:
                raise ValueError(f"For {match_type}, teams must have {expected_players} player(s).")

    @field_validator("teams")
    def validate_distinct_teams(values):
        """Ensure a player is not in both teams."""
        teams = values["teams"]
        all_players = []

        for team in teams:
            all_players.extend(player.id for player in team.players)

        player_ids = set(all_players)
        if len(player_ids) != len(all_players):
            raise ValueError("A player cannot be in both teams in the same game.")
        

    @field_validator("score")
    def validate_score_format(cls, score):
        """Ensure score is correctly formatted as 'X : Y'."""
        try:
            score_a, score_b = map(int, score.split(" : "))
        except ValueError:
            raise ValueError("Score must be in the format 'X : Y', where X and Y are integers.")
        return score

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

    __config__: ConfigDict = {
        'from_attributes': True,
    }


class Round(BaseModel):
    tournament_id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., description="Round name (Quarter-finals, Semi-finals, Finals)")
    rounds: List[Game]
    round_number: int = Field(..., ge=1, description="Round number must be atleast 1")

    @field_serializer("tournament_id")
    def serialize_uuid(self, tournament_id):
        return str(tournament_id)

    __config__: ConfigDict = {
        'from_attributes': True,
    }

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
    status: Literal["upcoming", "ongoing", "completed", "cancelled"] = "upcoming"  
    rounds_count: int
    location: str = Field(..., min_length=3, max_length=100, description="Tournament location")

    @model_validator(mode="before")
    @classmethod
    def validate_start_date(cls, values):
        start_date = values.get("start_date")
        status = values.get("status", "ongoing")
        if start_date and status == "ongoing" and start_date < date.today:
            raise ValueError("Ongoing tournaments cannot have a start date in the past.")
        return values
    
    __config__: ConfigDict = {
        'from_attributes': True,
    }
