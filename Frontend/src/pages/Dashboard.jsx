import React, { useState } from "react";
import { useTheme } from "../auth/ThemeContext.jsx";
import { useHistory } from "../auth/HistoryContext.jsx";

export default function Dashboard() {
  const { darkMode, toggleTheme } = useTheme();
  const { history, addHistory, clearHistory, renameHistoryItem } = useHistory();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  // Select/Deselect an item
  const handleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Rename an item
  const handleRename = (index) => {
    const newName = prompt("Enter new name:", history[index]);
    if (newName) renameHistoryItem(index, newName);
  };

  // Clear selected items
  const handleClearSelected = () => {
    if (selected.length === 0) return alert("Select items to clear.");
    if (window.confirm("Are you sure you want to clear selected items?")) {
      clearHistory(selected);
      setSelected([]);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Cipher AI Dashboard
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleTheme}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
          >
            Toggle Theme
          </button>
          <button
            onClick={() => addHistory(`Item ${history.length + 1}`)}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
          >
            Add Item
          </button>
          <button
            onClick={handleClearSelected}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
          >
            Clear Selected
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search history..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full mb-6 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 transition duration-300
          ${darkMode
            ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400"
            : "bg-white text-black border-gray-300 placeholder-gray-500"
          }`}
      />

      {/* History Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-min">
        {history.length ? (
          history.map((item, index) => {
            // Skip items that don't match search
            if (!item.toLowerCase().includes(search.toLowerCase())) return null;

            const isSelected = selected.includes(index);

            return (
              <div
                key={index}
                onClick={() => handleSelect(index)}
                onDoubleClick={() => handleRename(index)}
                className={`p-4 rounded-xl shadow-md cursor-pointer transform transition
                  ${
                    isSelected
                      ? "bg-red-500 text-white dark:bg-red-600"
                      : darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-white hover:bg-gray-100 text-black"
                  }`}
                style={{
                  wordBreak: "break-word",
                  overflowY: "auto",
                  maxHeight: "150px", // scroll if text is too long
                }}
              >
                {item}
                {isSelected && (
                  <span className="ml-2 text-sm font-semibold">(selected)</span>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No history items found.</p>
        )}
      </div>
    </div>
  );
}        
