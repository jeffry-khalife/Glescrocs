const db = require("../config/db");

exports.getAllMenus = async () => {
  const [rows] = await db.query("SELECT * FROM menus WHERE available = 1");
  return rows;
};

exports.createMenu = async (menu) => {
  const { name, description, price, image } = menu;
  await db.query(
    "INSERT INTO menus (name, description, price, image, available) VALUES (?, ?, ?, ?, 1)",
    [name, description, price, image || null]
  );
};

exports.updateMenu = async (id, menu) => {
  const { name, description, price, image, available } = menu;
  await db.query(
    "UPDATE menus SET name=?, description=?, price=?, image=?, available=? WHERE id=?",
    [name, description, price, image || null, available, id]
  );
};

exports.deleteMenu = async (id) => {
  await db.query("DELETE FROM menus WHERE id = ?", [id]);
};