import React, { useState, useEffect } from "react";
import { createUser, getUsers } from "../api/api";
import "../styles/Management.css";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.username || !formData.password) {
        setError("Tous les champs sont requis");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        setLoading(false);
        return;
      }

      await createUser(formData);
      setFormData({ username: "", password: "", role: "employee" });
      setShowForm(false);
      await fetchUsers();
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ username: "", password: "", role: "employee" });
    setShowForm(false);
    setError("");
  };

  return (
    <div className="management-section">
      <div className="management-header">
        <h2>👥 Gestion des Utilisateurs</h2>
        {!showForm && (
          <button
            className="management-add-btn"
            onClick={() => setShowForm(true)}
          >
            + Ajouter Utilisateur
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="management-form">
          {error && <div className="management-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Ex: jean123"
              />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 caractères"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select name="role" value={formData.role} onChange={handleInputChange}>
              <option value="employee">Employé</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="form-btn form-btn-save"
              disabled={loading}
            >
              {loading ? "..." : "Créer"}
            </button>
            <button
              type="button"
              className="form-btn form-btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="users-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <h3>{user.username}</h3>
                <p className="user-role">{user.role === "admin" ? "👑 Admin" : "👤 Employé"}</p>
                <p className="user-date">
                  Créé: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">Aucun utilisateur</p>
        )}
      </div>
    </div>
  );
}
