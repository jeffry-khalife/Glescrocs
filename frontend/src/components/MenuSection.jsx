import React, { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { createOrder } from "../api/api";
import "../styles/MenuSection.css";

export default function MenuSection() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch menus depuis l'API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/menus");
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des menus");
        }
        
        const data = await response.json();
        setMenus(data);
        setError(null);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleValidateOrder = async () => {
    if (!selectedMenuId) {
      alert("Merci de sélectionner un menu!");
      return;
    }

    try {
      const response = await createOrder(selectedMenuId);
      localStorage.setItem("myOrderId", response.id);
      
      // Afficher le message temporaire
      setSuccessMessage("✓ Commande créée! En attente de validation par l'admin");
      
      // Disparaître après 5 secondes
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      setSelectedMenuId(null); // Réinitialiser la sélection
      
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Erreur lors de la création de la commande:", err);
      alert("Erreur lors de la création de la commande");
    }
  };

  return (
    <section className="menu-section" id="menu-section">
      <div className="menu-container">
        <h2 className="menu-title">Nos Menus</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="menu-success-message">
            {successMessage}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="menu-loading">
            <p>Chargement</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="menu-error">
            <p>{error}</p>
          </div>
        )}

        {/* Menu List */}
        {!loading && menus.length > 0 && (
          <>
            <div className="menu-list">
              {menus.map((menu) => (
                <MenuItem 
                  key={menu.id} 
                  menu={menu}
                  isSelected={selectedMenuId === menu.id}
                  onSelect={setSelectedMenuId}
                />
              ))}
            </div>

            {/* Validate Button */}
            <div className="menu-actions">
              <button 
                className="validate-btn" 
                onClick={handleValidateOrder}
              >
                Valider la commande
              </button>
            </div>
          </>
        )}

        {/* No Menus State */}
        {!loading && menus.length === 0 && !error && (
          <div className="menu-empty">
            <p>Aucun menu disponible pour le moment</p>
          </div>
        )}
      </div>
    </section>
  );
}
