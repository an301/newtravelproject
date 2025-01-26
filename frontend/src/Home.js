import React from "react";
import "./Home.css";

const Home = ({ scrollToTripPlanner }) => {
  return (
    <div className="home-container">
      {/* Title */}
      <h1 className="title">TripSync</h1>
      <button className="account-button">
        <img
          src="/images/account-icon.png"
          alt="Account"
          className="account-icon"
        />
      </button>

      {/* Main Content Section */}
      <div className="content">
        {/* Past Trips */}
        <div className="box past-trips">
          <h2>Past Trips</h2>
          <p>No past trips yet.</p>
        </div>

        {/* New Suggestions */}
        <div className="box suggestions">
          <h2>New Suggestions</h2>
          <p>Explore amazing destinations!</p>
        </div>

        {/* Current Trip */}
        <div className="box current-trip">
          <h2>Current Trip</h2>
          <p>No active trip.</p>
        </div>
      </div>

      {/* Add Trip Button */}
      <button className="add-trip" onClick={scrollToTripPlanner}>
        + Add Trip
      </button>
    </div>
  );
};

export default Home;
