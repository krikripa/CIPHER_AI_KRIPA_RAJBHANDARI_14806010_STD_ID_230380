import { useHistoryStore } from "../../auth/HistoryContext";

export default function OutputPanel() {
  const store = useHistoryStore();
  const history = store?.history || [];
  const activeSession = store?.activeSession;

  const session = history.find((s) => s.id === activeSession);

  return (
    <div className="flex-1 p-4">
      <h3 className="font-semibold mb-2">Output</h3>
      <textarea
        value={session?.output || ""}
        readOnly
        className="w-full h-64 p-3 font-mono border rounded dark:bg-gray-800"
        placeholder="Decoded output will appear here..."
      />
    </div>
  );
}
