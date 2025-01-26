import React, { useState } from "react";
import "../styles/Itinerary.css"; // Import CSS

const ItineraryDisplay = ({ itinerary }) => {
    const [expandedDay, setExpandedDay] = useState(null);

    if (!itinerary || itinerary.trim() === "") {
        console.log("No itinerary data available."); // Debugging
        return <p className="itinerary-display">No itinerary generated yet.</p>;
    }

    console.log("Formatted Itinerary:", itinerary); // ✅ Debugging log

    // Ensure itinerary is a string
    const itineraryText = typeof itinerary === "string" ? itinerary : itinerary.itinerary;

    // Split itinerary into lines
    const lines = itineraryText.split("\n").map(line => line.trim()).filter(line => line);
    const parsedDays = [];
    let currentDay = null;

    lines.forEach(line => {
        if (/^Day \d+:/.test(line)) {
            // Start a new day's itinerary
            currentDay = { title: line, activities: [] };
            parsedDays.push(currentDay);
        } else if (currentDay && line.startsWith("-")) {
            // Extract activity details and price (e.g., "- Morning: Visit Shrine ($10)")
            const match = line.match(/- (.*?): (.*?)( \((\$\d+(\.\d+)?)\))?/);
            if (match) {
                currentDay.activities.push({
                    time: match[1] || "Anytime",  // Morning, Afternoon, Evening
                    name: match[2].trim(),        // Activity name
                    price: match[4] ? match[4] : "Free"  // Extracted price or "Free"
                });
            } else {
                // Handle activities without a clear price
                currentDay.activities.push({
                    time: "Anytime",
                    name: line.replace("- ", ""),
                    price: "Free"
                });
            }
        }
    });

    if (parsedDays.length === 0) {
        console.log("No parsed days found. Check data format.");
        return <p className="itinerary-display">Error: No itinerary data available.</p>;
    }

    const toggleDay = (index) => {
        setExpandedDay(expandedDay === index ? null : index);
    };

    return (
        <div className="itinerary-display">
            <h2>🗺️ Your AI-Powered Itinerary</h2>
            {parsedDays.map((day, index) => (
                <div key={index} className="itinerary-day" onClick={() => toggleDay(index)}>
                    <h3>{day.title} {expandedDay === index ? "▲" : "▼"}</h3>
                    {expandedDay === index && (
                        <ul className="itinerary-activities">
                            {day.activities.map((activity, i) => (
                                <li key={i}>
                                    <span className="activity-time">{activity.time}</span>
                                    <span className="activity-name">{activity.name}</span>
                                    <span className="activity-price">{activity.price}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ItineraryDisplay;
