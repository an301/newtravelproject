import React, { useState } from "react";
import "../styles/Itinerary.css"; // Import CSS

const ItineraryForm = ({ onGenerate }) => {
    const [destination, setDestination] = useState("");
    const [travelDates, setTravelDates] = useState("");
    const [budget, setBudget] = useState("");
    const [interests, setInterests] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(destination, travelDates.split(","), parseFloat(budget), interests.split(","));
    };

    return (
        <form className="itinerary-form" onSubmit={handleSubmit}>
            <label>Destination:</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} required />

            <label>Travel Dates (comma-separated):</label>
            <input type="text" value={travelDates} onChange={(e) => setTravelDates(e.target.value)} required />

            <label>Budget (USD):</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} required />

            <label>Interests (comma-separated):</label>
            <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} required />

            <button type="submit">Generate Itinerary</button>
        </form>
    );
};

export default ItineraryForm;
