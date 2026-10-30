import React from "react";
import "../styles/MenuItem.css";

export default function MenuItem({ menu, isSelected, onSelect }) {
  const price = typeof menu.price === 'string' ? parseFloat(menu.price) : menu.price;
  
  return (
    <div 
      className={`menu-item ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(menu.id)}
    >
      <div className="menu-item-image">
        <img 
          src={menu.image || "https://via.placeholder.com/150x150?text=Menu"} 
          alt={menu.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150x150?text=Menu";
          }}
        />
      </div>
      <p className="menu-item-name">{menu.name}</p>
      <p className="menu-item-price">{price.toFixed(2)}€</p>
    </div>
  );
}
