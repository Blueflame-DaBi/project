import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function GameTopup({ token }) {
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState("");
  const [itemId, setItemId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/games`)
      .then((res) => res.json())
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  const handleCheckout = async () => {
    if (!gameId || !itemId) return;

    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId, itemId }),
      });
      const data = await res.json();
      setMessage(res.ok ? `✅ Success! Transaction ID: ${data.transactionId}` : data.error);
    } catch {
      setMessage("❌ Network error");
    }
  };

  const selectedGame = games.find((g) => g.id === gameId);

  return (
    <div className="form">
      <h3>Top-up a Game</h3>
      <select value={gameId} onChange={(e) => setGameId(e.target.value)}>
        <option value="">-- Select Game --</option>
        {games.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {selectedGame && (
        <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
          <option value="">-- Select Package --</option>
          {selectedGame.items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - Rs. {item.price}
            </option>
          ))}
        </select>
      )}

      <button disabled={!itemId} onClick={handleCheckout}>
        Pay Now
      </button>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default GameTopup;
