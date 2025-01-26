import React, { useState } from "react";
import ItineraryForm from "../components/ItineraryForm";
import ItineraryDisplay from "../components/ItineraryDisplay";
import { fetchItinerary } from "../api/itinerary";
import "../styles/Itinerary.css"; // Import the CSS file

const ItineraryPage = () => {
    const [itinerary, setItinerary] = useState("");

    const generateItinerary = async (destination, travelDates, budget, interests) => {
        const aiGeneratedItinerary = await fetchItinerary(destination, travelDates, budget, interests);
        console.log("AI-Generated Itinerary:", aiGeneratedItinerary); // ✅ Debugging log
        setItinerary(aiGeneratedItinerary);
    };  

    return (
        <div className="itinerary-container">
            <h1 className="itinerary-title">🌍 TripSync AI Itinerary Planner</h1>
            <ItineraryForm onGenerate={generateItinerary} />
            {itinerary && <ItineraryDisplay itinerary={itinerary} />}
        </div>
    );
};

export default ItineraryPage;
