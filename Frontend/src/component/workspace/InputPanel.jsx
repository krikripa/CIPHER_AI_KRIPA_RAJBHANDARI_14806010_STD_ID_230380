import { useState, useEffect } from "react";
import { useHistoryStore } from "../../auth/HistoryContext";

export default function InputPanel() {
  const [tab, setTab] = useState("text");
  const [input, setInput] = useState("");

  const store = useHistoryStore();
  const history = store?.history || [];
  const activeSession = store?.activeSession;

  useEffect(() => {
    const session = history.find((s) => s.id === activeSession);
    if (session) {
      setInput(session.input);
      setTab(session.type || "text");
    }
  }, [activeSession, history]);

  return (
    <div className="flex-1 p-4 border-r dark:border-gray-700">
      <div className="flex gap-2 mb-2">
        {["text", "file", "image"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${tab === t ? "bg-blue-600 text-white" : "border"}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "text" && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 p-3 font-mono border rounded dark:bg-gray-800"
          placeholder="Paste encoded text here..."
        />
      )}

      {tab !== "text" && (
        <input
          type="file"
          className="mt-4"
          accept={tab === "image" ? "image/*" : ".txt,.bin"}
        />
      )}
    </div>
  );
}
