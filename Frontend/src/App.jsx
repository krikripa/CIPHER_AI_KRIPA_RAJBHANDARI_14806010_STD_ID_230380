import React, { useState } from "react";
import { ThemeProvider } from "./auth/ThemeContext.jsx";
import { HistoryProvider } from "./auth/HistoryContext.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EncodeDecode from "./pages/EncodeDecode.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState(null); // null = not logged in

  const renderPage = () => {
    if (!user) {
      if (activePage === "register") return <Register setUser={setUser} setActivePage={setActivePage} />;
      return <Login setUser={setUser} setActivePage={setActivePage} />;
    }

    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "encode-decode": return <EncodeDecode />;
      case "settings": return <Settings user={user} />;
      default: return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <HistoryProvider>
        <div className="flex h-screen">
          {user && <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} setUser={setUser} />}
          <div className="flex-1 overflow-auto">{renderPage()}</div>
        </div>
      </HistoryProvider>
    </ThemeProvider>
  );
}
