import React, { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import GameTopup from "./components/GameTopup";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload.username);
        setIsAdmin(payload.role === "admin");
      } catch {
        setToken("");
        setUser(null);
        setIsAdmin(false);
      }
    }
  }, [token]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <div className="container">
      {!token ? (
        <AuthForm setToken={setToken} />
      ) : (
        <>
          <h2>Welcome, {user}!</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <GameTopup token={token} />
          {isAdmin && <AdminPanel token={token} />}
        </>
      )}
    </div>
  );
}

export default App;
