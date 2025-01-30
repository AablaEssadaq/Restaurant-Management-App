import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const RestaurantContext = createContext();

// Custom hook to use the UserContext
export const useRestaurant = () => {
  return useContext(RestaurantContext);
};

// Create the provider component
export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(() => {
    // Charger depuis localStorage au premier rendu
    const storedRestaurant = localStorage.getItem("restaurant");
    return storedRestaurant ? JSON.parse(storedRestaurant) : null;
});

useEffect(() => {
  if (restaurant) {
    localStorage.setItem("restaurant", JSON.stringify(restaurant));
  }
  else {
    
    localStorage.removeItem("restaurant");
  }
}, [restaurant]);


  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};
