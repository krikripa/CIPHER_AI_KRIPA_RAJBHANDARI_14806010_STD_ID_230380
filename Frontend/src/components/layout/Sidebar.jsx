import React from "react";
import { useHistory } from "../../auth/HistoryContext.jsx";

export default function Sidebar({ activePage, setActivePage, user, setUser }) {
  const { history } = useHistory();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">{user.name}</div>
      
      <nav className="flex-1 p-2 overflow-auto">
        <button
          className={`w-full text-left p-2 rounded hover:bg-gray-700 ${activePage === "dashboard" ? "bg-gray-700" : ""}`}
          onClick={() => setActivePage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`w-full text-left p-2 rounded hover:bg-gray-700 ${activePage === "encode-decode" ? "bg-gray-700" : ""}`}
          onClick={() => setActivePage("encode-decode")}
        >
          Encode/Decode
        </button>
        <button
          className={`w-full text-left p-2 rounded hover:bg-gray-700 ${activePage === "settings" ? "bg-gray-700" : ""}`}
          onClick={() => setActivePage("settings")}
        >
          Settings
        </button>

        <div className="mt-4 border-t border-gray-700 pt-2">
          <h3 className="font-semibold mb-1">History</h3>
          <div className="flex flex-col gap-1 max-h-64 overflow-auto">
            {history.length === 0 && <div className="text-gray-400 text-sm">No history yet</div>}
            {history.map((item, idx) => (
              <div key={idx} className="bg-gray-700 p-2 rounded text-sm">{item}</div>
            ))}
          </div>
        </div>
      </nav>

      <button
        className="m-2 p-2 bg-red-500 rounded hover:bg-red-600"
        onClick={() => setUser(null)}
      >
        Logout
      </button>
    </div>
  );
}
