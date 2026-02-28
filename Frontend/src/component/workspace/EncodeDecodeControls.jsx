import { useHistoryStore } from "../../auth/HistoryContext";

export default function EncodeDecodeControls() {
  const { addSession } = useHistoryStore();

  const runAutoDetect = () => {
    const session = {
      id: crypto.randomUUID(),
      title: "Auto Decode",
      type: "text",
      input: "SGVsbG8gd29ybGQ=",
      output: "Hello world",
      method: "Auto Detect"
    };

    addSession(session);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={runAutoDetect}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Auto Detect
      </button>

      <select className="px-2 py-1 border rounded dark:bg-gray-800">
        <option>Encode</option>
        <option>Base64</option>
        <option>Hex</option>
        <option>URL</option>
      </select>

      <select className="px-2 py-1 border rounded dark:bg-gray-800">
        <option>Decode</option>
        <option>Base64</option>
        <option>Hex</option>
        <option>Binary</option>
      </select>
    </div>
  );
}
