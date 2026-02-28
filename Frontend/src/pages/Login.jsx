import React, { useState } from "react";

export default function Login({ setUser, setActivePage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password)
      return alert("Enter both username and password");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.detail);

      localStorage.setItem("username", username);
      setUser({ name: username });
      setActivePage("dashboard");
    } catch {
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-blue-200 via-indigo-200 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-80 transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 animate-pulse">
          Login
        </h2>

        <input
          type="text"
          className="border-2 border-gray-300 p-3 w-full mb-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border-2 border-gray-300 p-3 w-full mb-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1"
          onClick={handleLogin}
        >
          Login
        </button>

        <p
          className="mt-5 text-sm text-center text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => setActivePage("register")}
        >
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}
