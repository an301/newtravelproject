import axios from "axios";

const API_URL = "http://127.0.0.1:8000/itinerary/";

export const fetchItinerary = async (destination, travelDates, budget, interests) => {
    try {
        const response = await axios.post(API_URL, {
            destination,
            travel_dates: travelDates,
            budget,
            interests
        });

        return response.data.itinerary;
    } catch (error) {
        console.error("Error fetching itinerary:", error);
        return null;
    }
};
