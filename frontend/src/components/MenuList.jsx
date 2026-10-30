import React, { useEffect, useState } from "react";
import { getMenus } from "../api/api";

export default function MenuList({ onSelect }) {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    getMenus().then(setMenus);
  }, []);

  return (
    <div>
      <h2>Menu du jour</h2>
      {menus.map((menu) => (
        <div key={menu.id} className="card">
          <h3>{menu.name}</h3>
          <p>{menu.description}</p>
          <p>{menu.price}€</p>
          <button onClick={() => onSelect(menu.id)}>Commander</button>
        </div>
      ))}
    </div>
  );
}