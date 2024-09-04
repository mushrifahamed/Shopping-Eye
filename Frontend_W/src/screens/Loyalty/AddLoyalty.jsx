import React, { useState } from "react";

const LoyaltyPoints = () => {
  // Static data for the user's initial points
  const initialPoints = 100;
  
  // State to manage the user's points
  const [points, setPoints] = useState(initialPoints);

  // Function to add points
  const addLoyaltyPoints = () => {
    // Static data for points to be added
    const pointsToAdd = 50;
    setPoints(points + pointsToAdd);
  };

  return (
    <div>
      <h2>Your Loyalty Points: {points}</h2>
      <button onClick={addLoyaltyPoints}>Add 50 Points</button>
    </div>
  );
};

export default LoyaltyPoints;
