from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import itinerary

app = FastAPI(title="TripSync AI - Itinerary Generator")
# ✅ Add CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ Change this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # ✅ Allow all headers
)
app.include_router(itinerary.router, prefix="/itinerary", tags=["Itinerary"])

@app.get("/")
def root():
    return {"message": "Welcome to TripSync AI - Travel Itinerary Generator"}
