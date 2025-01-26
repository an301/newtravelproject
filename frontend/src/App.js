import React from "react";
import MapComponent from "./Map";
import Home from "./Home"; // Import Home.js

function App() {
  return (
    <div>
      <Home /> {/* Display Home Page */}
      <MapComponent />
    </div>
  );
}

export default App;
