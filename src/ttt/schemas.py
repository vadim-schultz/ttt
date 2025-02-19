from uuid import UUID, uuid4
from pydantic import BaseModel, Field, conint, model_validator
from typing import List, Literal

class Player(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=2, max_length=50, description="Player's name")
    score: int = Field(0, ge=0, le=4, description="Score in the game (0-4)")


    class Config:
        from_attributes = True
    
class Team(BaseModel):
    id:UUID = Field(default_factory=uuid4)
    players:List[Player]

    @model_validator(mode="before")
    @classmethod
    def check_players(cls, values):
        players = values.get("players", [])
        if len(players) not in [1, 2]:
            raise ValueError("Teams must have either 1 player(singles) or 2 players(Doubles). ")
        return values

        class Config:
            from_attributes = True

class Game(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    round_id: UUID
    match_type: Literal["Singles", "Doubles"]
    team_a: Team
    team_b:Team
    score: str = Field("0: 0", description="Default score at the start")

    @model_validator
    @classmethod
    def validate_match(cls, values):

        score = values["score"]
    
    @staticmethod
    def validate_team_size(values):
        match_type = values["match_type"]
        team_a = values["team_a"]
        team_b = values["team_b"]
        expected_players = 1 if match_type == "singles" else 2

        if len(team_a.plyers) != expected_players or len(team_b) != expected_players:
            raise ValueError(f"For {match_type}, teams must have {expected_players} player(s)")
        
    @staticmethod
    def validate_distinct_teams(values):
        team_a = values["team_a"]
        team_b = values["team_b"]

        players_a = {player.id for player in team_a.players}
        players_b = {player.id for player in team_b.players}

        if players_a & players_b:
            raise ValueError("A player cannot be in both teams in the same game")

    @staticmethod
    def validate_score_format(values):
        score = values["score"]
        try:
            score_a, score_b = map(int, score.split(" : "))
        except ValueError:
            raise ValueError("Score must be in the format 'X : Y are integers")
        
    @staticmethod
    def validate_total_score(values):
        score_a, score_b = map(int, values["score"].split(" : "))
        if score_a + score_b not in [0, 4]:
            raise ValueError("Total game score must be 4 ( or 0 if not started).")
        
    @staticmethod
    def validate_no_ties(values):
        score_a, score_b = map(int, values["score"].split(" : "))
        if score_a == score_b and score_a > 0:
            raise ValueError("A game must have a winner(No ties allowed).")
        
    class Config:
        from_attribute = True
    

class Round(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    tournament_id: UUID
    name: str = Field(..., description="Round name (Quater-finals, Semi-finals, Finals)")
    rounds : List[Game]

    class Config:
        from_attribute = True


class Tournament(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=3, max_length= 100, description="Tournament name")
    rounds: List[Round]

    class Config:
        from_attributes = True        
    

        