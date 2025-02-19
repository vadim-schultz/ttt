from pydantic import BaseModel, Field
from uuid import UUID, uuid4 #uuid 4 as it 

class Player(BaseModel):
    id: UUID = Field(default_factory=uuid4)  # Explicitly use UUID here
    name: str
    score: int

    class Config:                       
        arbitrary_types_allowed = True          #needs to be true to handle arbitrary values

# Create a new Player instance
player = Player(name="John Doe", score=5)

# Print the generated UUID
print(player.id)
