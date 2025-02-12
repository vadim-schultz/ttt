from pydantic import BaseModel


class StatsSchema(BaseModel):
    uuid: int
    path: str
    count: int

    class Config:
        from_attributes = True


class MatchSchema(BaseModel):
    id: int
    player0: str
    player1: str
    player2: str
    player3: str
    score0: int
    score1: int

    class Config:
        from_attributes = True
