import React, { useState, useRef, useEffect } from "react";
import MapComponent from "./Map";
import "./TripPlanner.css";

const TripPlanner = () => {
  const [startingLocation, setStartingLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState("");
  const [dietary, setDietary] = useState("");
  const [submittedLocation, setSubmittedLocation] = useState("");
  const [showHotelsAirlines, setShowHotelsAirlines] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const hotelsAirlinesRef = useRef(null);

  // Validate form fields
  useEffect(() => {
    const isValidBudget = /^[0-9]+(\.[0-9]{1,2})?$/.test(budget); // Allows integers & decimals (up to 2 decimal places)
    const isEndDateValid = new Date(endDate) > new Date(startDate); // Ensure end date is after start date

    setIsFormValid(
      startingLocation.trim() &&
        destination.trim() &&
        startDate &&
        endDate &&
        budget &&
        dietary &&
        interests.trim() &&
        isValidBudget &&
        isEndDateValid
    );
  }, [
    startingLocation,
    destination,
    startDate,
    endDate,
    budget,
    dietary,
    interests,
  ]);

  const handleSubmit = () => {
    if (isFormValid) {
      setSubmittedLocation(destination);
      setShowHotelsAirlines(true); // Show the button after valid submission
    }
  };

  const scrollToHotelsAirlines = () => {
    hotelsAirlinesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="trip-planner-container">
      <div className="top-section">
        <div className="left-section">
          <h2>Starting Location</h2>
          <div className="starting-location">
            <input
              type="text"
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value)}
              placeholder="Enter Starting Location"
            />
          </div>

          <h2>Destination</h2>
          <div className="destination-input">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter Destination"
            />
          </div>

          <div className="date-inputs">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  borderColor:
                    endDate && new Date(endDate) <= new Date(startDate)
                      ? "red"
                      : "",
                }}
              />
            </div>
          </div>

          <h2>Budget</h2>
          <div className="budget-container">
            <span>$</span>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter Budget"
              style={{
                borderColor:
                  budget && !/^[0-9]+(\.[0-9]{1,2})?$/.test(budget)
                    ? "red"
                    : "",
              }}
            />
          </div>

          <div className="dietary-section">
            <h2>Select Dietary Restrictions</h2>
            <div className="dietary-buttons">
              {["Vegan", "Vegetarian", "Non-Vegetarian"].map((option) => (
                <button
                  key={option}
                  className={dietary === option ? "selected" : ""}
                  onClick={() => setDietary(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <h2>Interests</h2>
          <div className="interests-container">
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Enter Interests"
            />
          </div>
        </div>

        <div className="right-section">
          <h2>Map</h2>
          <div className="map-container">
            <MapComponent location={submittedLocation} />
          </div>
        </div>
      </div>

      {/* Submit & Show Hotels & Airlines Buttons */}
      <div className="button-container">
        <button onClick={handleSubmit} disabled={!isFormValid}>
          Submit
        </button>
        {showHotelsAirlines && (
          <button onClick={scrollToHotelsAirlines}>
            Show Hotels & Airlines
          </button>
        )}
      </div>

      {/* Hotels & Airlines Section */}
      <div ref={hotelsAirlinesRef} className="info-sections">
        <div className="airlines">
          <h2>Airlines</h2>
        </div>
        <div className="hotels">
          <h2>Hotels</h2>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
