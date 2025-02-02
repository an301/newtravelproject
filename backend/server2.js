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
                dest_id: dest_id, // Location IDx
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


app.get("/flights", async (req, res) => {
    const { fromId, toId, departDate, returnDate, adults, children, sort, cabinClass, currency_code } = req.query;

    if (!fromId || !toId || !departDate) {
        return res.status(400).json({ error: "Missing required parameters (fromId, toId, departDate)" });
    }

    try {
        console.log("Fetching flight search results...");
        const searchResponse = await axios.get("https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights", {
            headers: {
                "X-RapidAPI-Key": BOOKING_API_KEY,
                "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
            },
            params: {
                fromId,
                toId,
                departDate,
                returnDate: returnDate || "",
                adults: adults || 1,
                children: children || "",
                sort: sort || "BEST",
                cabinClass: cabinClass || "ECONOMY",
                currency_code: currency_code || "USD"
            },
        });

        const flightOffers = searchResponse.data.data?.flightOffers || [];

        if (!flightOffers.length) {
            return res.status(500).json({
                error: "No flights found in response",
                apiResponse: searchResponse.data
            });
        }

        // Step 2: Fetch details for each flight
        console.log("Fetching detailed flight data...");
        const detailedFlights = await Promise.all(
            flightOffers.slice(0, 5).map(async (flight) => { // Limit to 5 flights to avoid too many requests
                try {
                    const detailsResponse = await axios.get("https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails", {
                        headers: {
                            "X-RapidAPI-Key": BOOKING_API_KEY,
                            "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
                        },
                        params: { token: flight.token, currency_code: "USD" },
                    });

                    const details = detailsResponse.data.data;
                    const segment = details.segments[0];

                    return {
                        flight_id: details.token,
                        airline: segment.legs[0]?.carriersData[0]?.name || "Unknown Airline",
                        airline_logo: segment.legs[0]?.carriersData[0]?.logo || null,
                        departure_airport: segment.departureAirport?.name || "Unknown",
                        arrival_airport: segment.arrivalAirport?.name || "Unknown",
                        departure_time: segment.departureTime || "Unknown",
                        arrival_time: segment.arrivalTime || "Unknown",
                        duration: details.segments.reduce((total, seg) => total + seg.totalTime, 0) || "Unknown",
                        stops: details.segments.length - 1 || 0,
                        flight_number: segment.legs.map(leg => leg.flightInfo?.flightNumber).join(", ") || "N/A",
                        price: details.priceBreakdown?.total?.units || "Unknown",
                        currency: details.priceBreakdown?.total?.currencyCode || "USD",
                        baggage_policy: details.baggagePolicies.map(bp => `${bp.name}: ${bp.url}`).join(", ") || "N/A",
                        cabin_class: segment.legs[0]?.cabinClass || "ECONOMY"
                    };
                } catch (error) {
                    console.error("Error fetching flight details:", error.response?.data || error.message);
                    return null; // Skip this flight if details cannot be fetched
                }
            })
        );

        // Remove any null results (in case some flights failed to fetch details)
        const filteredFlights = detailedFlights.filter(flight => flight !== null);

        res.json({ flights: filteredFlights });
    } catch (error) {
        console.error("Error fetching flights:", error.response ? error.response.data : error.message);
        res.status(500).json({
            error: "Failed to fetch flights",
            details: error.response ? error.response.data : error.message
        });
    }
});



// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});