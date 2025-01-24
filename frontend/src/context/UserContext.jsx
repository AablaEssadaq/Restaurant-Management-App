import React, { createContext, useState, useContext } from "react";

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to store the authenticated user

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
