import React, { useState } from "react";

const API_BASE = "http://localhost:5000/api";

function AuthForm({ setToken }) {
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    adminCode: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      authMode === "signup" &&
      (!/^[0-9]{10}$/.test(form.phone) ||
        !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password))
    ) {
      return setMessage(
        "Phone must be 10 digits. Password must include 1 uppercase, 1 number, and 1 special character."
      );
    }

    const url = `${API_BASE}/${authMode}`;
    const body =
      authMode === "signup"
        ? {
            username: form.username,
            email: form.email,
            phone: form.phone,
            password: form.password,
            adminCode: form.adminCode,
          }
        : {
            username: form.username,
            password: form.password,
          };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        if (authMode === "login") {
          setToken(data.token);
          localStorage.setItem("token", data.token);
        } else {
          setMessage("Signup successful! Please login.");
          setAuthMode("login");
        }
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setMessage("Network error.");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{authMode === "login" ? "Login" : "Register"}</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      {authMode === "signup" && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            placeholder="Admin Code (optional)"
            value={form.adminCode}
            onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
          />
        </>
      )}
      <button type="submit">{authMode === "login" ? "Login" : "Signup"}</button>
      <p>
        {authMode === "login" ? "No account?" : "Have an account?"}{" "}
        <span className="link" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
          {authMode === "login" ? "Register here" : "Login here"}
        </span>
      </p>
      {message && <div className="message">{message}</div>}
    </form>
  );
}

export default AuthForm;
