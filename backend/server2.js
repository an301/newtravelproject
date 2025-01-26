require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const BOOKING_API_KEY = process.env.BOOKING_API_KEY;

// Fetch Hotels by City
app.get("/hotels", async (req, res) => {
    const { dest_id, checkin_date, checkout_date } = req.query;

    if (!dest_id || !checkin_date || !checkout_date) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const response = await axios.get("https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels", {
            headers: {
                "X-RapidAPI-Key": BOOKING_API_KEY,
                "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
            },
            params: {
                dest_id: dest_id, // Location ID
                search_type: "CITY",
                arrival_date: checkin_date, // YYYY-MM-DD
                departure_date: checkout_date, // YYYY-MM-DD
                adults: "1",  // Ensure at least 1 adult
                page_number: "1",
                units: "metric",
                temperature_unit: "c",
                languagecode: "en-us",
                currency_code: "USD"
            },
        });

        let hotels = response.data.data.hotels.map(hotel => ({
            id: hotel.hotel_id,
            name: hotel.property.name,
            image: hotel.property.photoUrls[0] || null, // First image URL (null if missing)
            rating: hotel.property.reviewScore || null,
            rating_word: hotel.property.reviewScoreWord || "No Rating",
            price_per_night: hotel.property.priceBreakdown?.excludedPrice?.value || null,
            original_price: hotel.property.priceBreakdown?.strikethroughPrice?.value || null,
            currency: hotel.property.priceBreakdown?.excludedPrice?.currency || "USD",
            free_cancellation: hotel.property.priceBreakdown?.benefitBadges?.some(badge => badge.text.includes("Free cancellation")) || false,
            location: {
                latitude: hotel.property.latitude || null,
                longitude: hotel.property.longitude || null
            }
        }));

        // Sort hotels by rating (highest first)
        hotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        // Ensure we store at least 10 hotels (or fewer if not available)
        hotels = hotels.slice(0, 10);

        // Save the data
        fs.writeFileSync("hotels.json", JSON.stringify({ hotels }, null, 2));

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching hotels:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});