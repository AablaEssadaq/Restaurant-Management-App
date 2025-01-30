import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
      // Charger depuis localStorage au premier rendu
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
  })

useEffect(() => {
    if (user) {
      // Store the entire user object in localStorage
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Remove user from localStorage if it's null
      localStorage.removeItem("user");
    }
  
}, [user]);

return (
  <UserContext.Provider value={{ user, setUser }}>
      {children}
  </UserContext.Provider>
);
}