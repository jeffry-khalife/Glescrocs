import React, { useState } from "react";
import { loginAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    try {
      const res = await loginAdmin(username, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/admin/dashboard");
      } else {
        setError(res.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">GlesCrocs</h1>
            <p className="admin-login-subtitle">Admin</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            {error && (
              <div className="admin-login-error">
                ❌ {error}
              </div>
            )}

            <div className="admin-form-group">
              <label htmlFor="username" className="admin-form-label">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-form-input"
                disabled={loading}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-form-input"
                disabled={loading}
              />
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? "Connexion..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}