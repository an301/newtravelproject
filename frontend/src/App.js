import React, { useRef } from "react";
import Home from "./Home";
import TripPlanner from "./TripPlanner";

const App = () => {
  const tripPlannerRef = useRef(null);

  const scrollToTripPlanner = () => {
    tripPlannerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Home scrollToTripPlanner={scrollToTripPlanner} />
      <div ref={tripPlannerRef}>
        <TripPlanner />
      </div>
    </div>
  );
};

export default App;
