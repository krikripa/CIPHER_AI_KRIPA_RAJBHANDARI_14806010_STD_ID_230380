import React from "react";

export default function Settings({ user }) {
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-xl mt-10 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Settings</h2>

      <div className="mb-4">
        <p className="text-gray-600 mb-1">Username:</p>
        <p className="font-semibold text-gray-800">{user.name}</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-1">Change Password:</p>
        <input
          type="password"
          placeholder="New password"
          className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition">
        Save Changes
      </button>
    </div>
  );
}
