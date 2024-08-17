import React, { createContext, useState, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  // State to hold the reserved book IDs
  const [reservedBookIds, setReservedBookIds] = useState([]);

  // Function to reserve a book
  const reserveBook = (bookId) => {
    setReservedBookIds((prevIds) => [...prevIds, bookId]);
  };

  // Function to cancel a reservation
  const cancelReservation = (bookId) => {
    setReservedBookIds((prevIds) => prevIds.filter((id) => id !== bookId));
  };

  return (
    <AuthContext.Provider
      value={{ reservedBookIds, reserveBook, cancelReservation }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};
