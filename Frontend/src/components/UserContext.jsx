import React, { createContext, useState, useContext } from 'react';

// Create User Context
const UserContext = createContext();

// Context Provider Component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // Manage logged-in user

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to Use User Context
export function useUser() {
  return useContext(UserContext);
}