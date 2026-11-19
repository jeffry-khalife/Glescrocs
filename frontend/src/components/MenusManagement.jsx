import React, { useState } from "react";
import { createMenu, updateMenu, deleteMenu } from "../api/api";
import "../styles/Management.css";

export default function MenusManagement({ menus, onMenusUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.name || !formData.price) {
        setError("Le nom et le prix sont requis");
        setLoading(false);
        return;
      }

      if (editingId) {
        await updateMenu(editingId, {
          ...formData,
          price: parseFloat(formData.price),
          available: true,
        });
      } else {
        await createMenu({
          ...formData,
          price: parseFloat(formData.price),
        });
      }

      setFormData({ name: "", description: "", price: "", image: "" });
      setEditingId(null);
      setShowForm(false);
      onMenusUpdate();
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu) => {
    setFormData({
      name: menu.name,
      description: menu.description || "",
      price: menu.price,
      image: menu.image || "",
    });
    setEditingId(menu.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce menu?")) {
      try {
        await deleteMenu(id);
        onMenusUpdate();
      } catch (err) {
        setError("Erreur lors de la suppression");
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", price: "", image: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  return (
    <div className="management-section">
      <div className="management-header">
        <h2>📋 Gestion des Menus</h2>
        {!showForm && (
          <button
            className="management-add-btn"
            onClick={() => setShowForm(true)}
          >
            + Ajouter Menu
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="management-form">
          {error && <div className="management-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nom du menu</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Pasta Carbonara"
              />
            </div>
            <div className="form-group">
              <label>Prix</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Ex: 12.50"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description du menu..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>URL Image</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="form-btn form-btn-save"
              disabled={loading}
            >
              {loading ? "..." : editingId ? "Modifier" : "Ajouter"}
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

      <div className="management-list">
        {menus.length > 0 ? (
          menus.map((menu) => (
            <div key={menu.id} className="management-item">
              {menu.image && (
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="management-item-image"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div className="management-item-info">
                <h3>{menu.name}</h3>
                {menu.description && <p>{menu.description}</p>}
                <p className="item-price">{menu.price}€</p>
              </div>
              <div className="management-item-actions">
                <button
                  className="action-btn action-edit"
                  onClick={() => handleEdit(menu)}
                >
                  ✏️
                </button>
                <button
                  className="action-btn action-delete"
                  onClick={() => handleDelete(menu.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">Aucun menu</p>
        )}
      </div>
    </div>
  );
}
