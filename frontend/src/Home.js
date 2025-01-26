import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Title */}
      <h1 className="title">TripSync</h1>
      <button className="account-button">
        👤
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
      <button className="add-trip">+ Add Trip</button>
    </div>
  );
};

export default Home;
