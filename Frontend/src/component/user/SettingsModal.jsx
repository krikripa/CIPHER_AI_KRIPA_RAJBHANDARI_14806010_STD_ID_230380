// src/components/layout/Sidebar.jsx
import { useHistoryStore } from "../../auth/HistoryContext";

export default function Sidebar() {
  const store = useHistoryStore();
  const history = store?.history || [];
  const activeSession = store?.activeSession;
  const setActiveSession = store?.setActiveSession || (() => {});
  const deleteSession = store?.deleteSession || (() => {});

  return (
    <aside className="w-64 border-r dark:border-gray-700 p-3 overflow-y-auto">
      <h2 className="font-semibold mb-3">History</h2>
      {history.length === 0 && <p className="text-sm opacity-60">No sessions yet</p>}

      <ul className="space-y-2 text-sm">
        {history.map((session) => (
          <li
            key={session.id}
            className={`flex justify-between items-center p-2 rounded cursor-pointer
              ${
                activeSession === session.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            onClick={() => setActiveSession(session.id)}
          >
            <span className="truncate">{session.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSession(session.id);
              }}
              className="text-xs text-red-400 ml-2"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
