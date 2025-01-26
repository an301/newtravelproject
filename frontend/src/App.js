// import React, { useRef } from "react";
// import Home from "./Home";
// import TripPlanner from "./TripPlanner";

// const App = () => {
//   const tripPlannerRef = useRef(null);

//   const scrollToTripPlanner = () => {
//     tripPlannerRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div>
//       <Home scrollToTripPlanner={scrollToTripPlanner} />
//       <div ref={tripPlannerRef}>
//         <TripPlanner />
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState, useRef } from 'react';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import TripPlanner from './TripPlanner';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showSignup, setShowSignup] = useState(false);
    const tripPlannerRef = useRef(null);

    const scrollToTripPlanner = () => {
        tripPlannerRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleLogin = (username) => {
        setCurrentUser(username);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    const handleSignupSuccess = () => {
        setShowSignup(false);
    };

    if (!isLoggedIn) {
        return (
            <div>
                {showSignup ? (
                    <Signup 
                        onSignup={handleSignupSuccess} 
                        onLoginClick={() => setShowSignup(false)}
                    />
                ) : (
                    <Login 
                        onLogin={handleLogin} 
                        onSignupClick={() => setShowSignup(true)} 
                    />
                )}
            </div>
        );
    }

    return (
        <div>
            <Home scrollToTripPlanner={scrollToTripPlanner} />
            <div ref={tripPlannerRef}>
                <TripPlanner />
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default App;