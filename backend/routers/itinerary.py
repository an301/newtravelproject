from fastapi import APIRouter
from models.itinerary_model import ItineraryRequest
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha"
HEADERS = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
    "Content-Type": "application/json"
}


@router.post("/")
async def generate_itinerary(request: ItineraryRequest):
    prompt = f"""
    Generate a structured travel itinerary for a trip to {request.destination}.
    Dates: {', '.join(request.travel_dates)}
    Budget: ${request.budget}
    Interests: {', '.join(request.interests)}

    Return a day-by-day plan:
    - Morning, Afternoon, and Evening activities.
    - Specific locations to visit.
    - Recommended restaurants for each meal.
    - Transportation tips.
    - Estimated costs per activity.
    - Keep it concise and budget-friendly.
    """
    # 🔍 Debug: Check if the API Key is being loaded correctly
    if not HUGGINGFACE_API_KEY:
        print("🚨 ERROR: Hugging Face API Key not found! Check .env file.")
        return {"error": "Hugging Face API Key not found! Make sure it's set in .env."}
    else:
        print(f"🔍 Using Hugging Face API Key: {HUGGINGFACE_API_KEY[:5]}********")
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code == 200:
        return {"itinerary": response.json()[0]["generated_text"]}
    else:
        print(f"🚨 API Request Failed: {response.status_code}, {response.json()}")
        return {"error": response.json()}
