const db = require("../config/db");

exports.findByUsername = async (username) => {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0];
};

exports.createUser = async (username, hashedPassword, role) => {
  await db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role]
  );
};

exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT id, username, role, created_at FROM users");
  return rows;
};
