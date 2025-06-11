import React, { createContext, useState, useEffect } from "react";

// Create a context to share authentication state
export const AuthContext = createContext();

// Provide authentication state to child components
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user login info exists in localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    // Make isLoggedIn and setIsLoggedIn available to consumers
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
