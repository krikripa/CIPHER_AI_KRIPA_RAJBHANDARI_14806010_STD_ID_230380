import React, { createContext, useState, useContext } from "react";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Add new item
  const addHistory = (item) => setHistory((prev) => [...prev, item]);

  // Clear selected items
  const clearHistory = (indices = null) => {
    if (!indices) {
      // Clear all
      setHistory([]);
    } else {
      // Remove selected indices
      setHistory((prev) =>
        prev.filter((_, index) => !indices.includes(index))
      );
    }
  };

  // Rename a specific item
  const renameHistoryItem = (index, newName) => {
    setHistory((prev) =>
      prev.map((item, i) => (i === index ? newName : item))
    );
  };

  return (
    <HistoryContext.Provider
      value={{ history, addHistory, clearHistory, renameHistoryItem }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
