import { useState } from "react";
import SettingsModal from "./SettingsModal";
import { useHistoryStore } from "../../auth/HistoryContext";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const store = useHistoryStore();
  const clearHistory = store?.clearHistory || (() => alert("History cleared (fallback)"));
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border px-3 py-1 rounded"
      >
        User ⚙
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded shadow">
          <button
            onClick={() => {
              setShowSettings(true);
              setOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Settings
          </button>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onClearHistory={clearHistory}
          onLogout={logout}
        />
      )}
    </div>
  );
}
