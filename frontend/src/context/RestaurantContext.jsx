import React, { createContext, useState, useContext } from "react";

// Create the context
const RestaurantContext = createContext();

// Custom hook to use the UserContext
export const useRestaurant = () => {
  return useContext(RestaurantContext);
};

// Create the provider component
export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null);

  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};
