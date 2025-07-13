import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function AdminPanel({ token }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [token]);

  return (
    <div className="form admin-panel">
      <h3>Admin Panel - Customers</h3>
      <ul>
        {users.map((u, i) => (
          <li key={i}>
            👤 <strong>{u.username}</strong> — 📧 {u.email} — 📱 {u.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
