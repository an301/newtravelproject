from pydantic import BaseModel
from typing import List

class ItineraryRequest(BaseModel):
    destination: str
    travel_dates: List[str]  # List of dates
    budget: float
    interests: List[str]  # List of interests (e.g., adventure, food, culture)
