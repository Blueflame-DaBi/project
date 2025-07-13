import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

export default function GameTopup() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState('');
  const [itemId, setItemId] = useState('');
  const [message, setMessage] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '' });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload.username);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    fetch(`${API_BASE}/games`)
      .then(res => res.json())
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  const handleAuth = async () => {
    setMessage('');
    const url = `${API_BASE}/${authMode}`;
    const body =
      authMode === 'signup'
        ? { username: form.username, password: form.password, email: form.email, phone: form.phone }
        : { username: form.username, password: form.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (authMode === 'login') {
          setToken(data.token);
          setMessage(`Welcome, ${form.username}!`);
          resetForm();
        } else {
          setMessage('Signup successful! You can now login.');
          setAuthMode('login');
        }
      } else {
        setMessage(data.error || 'Error occurred');
      }
    } catch {
      setMessage('Network error');
    }
  };

  const handleCheckout = async () => {
    if (!gameId || !itemId) {
      setMessage('Please select a game and item');
      return;
    }
    setMessage('Processing payment...');
    try {
      const res = await fetch(`${API_BASE}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gameId, itemId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Transaction ID: ${data.transactionId}`);
      } else {
        setMessage(data.error || 'Payment failed');
      }
    } catch {
      setMessage('Network error during payment');
    }
  };

  const resetForm = () => {
    setForm({ username: '', password: '', email: '', phone: '' });
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: 20 }}>GameTopup</h1>

      {!token ? (
        <div style={styles.authBox}>
          <h2>{authMode === 'login' ? 'Login' : 'Signup'}</h2>
          <input
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          {authMode === 'signup' && (
            <>
              <input
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Phone Number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </>
          )}
          <button style={styles.button} onClick={handleAuth}>
            {authMode === 'login' ? 'Login' : 'Signup'}
          </button>
          <p style={{ marginTop: 10 }}>
            {authMode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
            <button
              style={styles.linkButton}
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                resetForm();
                setMessage('');
              }}
            >
              {authMode === 'login' ? 'Register here' : 'Login here'}
            </button>
          </p>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      ) : (
        <div style={styles.appBox}>
          <p>
            Welcome <b>{user}</b>{' '}
            <button
              onClick={() => {
                setToken('');
                setMessage('Logged out');
                setGameId('');
                setItemId('');
              }}
            >
              Logout
            </button>
          </p>

          <div style={{ marginBottom: 20 }}>
            <label>
              Select Game:{' '}
              <select
                value={gameId}
                onChange={e => {
                  setGameId(e.target.value);
                  setItemId('');
                  setMessage('');
                }}
              >
                <option value="">-- Select --</option>
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {gameId && (
            <div style={{ marginBottom: 20 }}>
              <label>
                Select Credit Package:{' '}
                <select value={itemId} onChange={e => setItemId(e.target.value)}>
                  <option value="">-- Select --</option>
                  {games
                    .find(g => g.id === gameId)
                    .items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - Rs. {item.price}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          )}

          <button style={styles.button} onClick={handleCheckout} disabled={!itemId}>
            Pay Now
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '40px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  authBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  appBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '8px 0',
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: '1px solid #aaa',
  },
  button: {
    padding: 12,
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
    fontSize: 14,
  },
  message: {
    marginTop: 15,
    color: 'green',
    fontWeight: 'bold',
  },
};
