const db = require("../config/db");

exports.createOrder = async (menu_id) => {
  const [result] = await db.query(
    "INSERT INTO orders (menu_id, status) VALUES (?, 'pending')",
    [menu_id]
  );
  return result.insertId;
};

exports.getAllOrders = async () => {
  const [rows] = await db.query("SELECT * FROM orders");
  return rows;
};

exports.getNextOrderNumber = async () => {
  const [rows] = await db.query("SELECT MAX(order_number) as max FROM orders");
  return (rows[0].max || 0) + 1;
};

exports.validateOrder = async (id, order_number) => {
  await db.query(
    "UPDATE orders SET status='validated', order_number=? WHERE id=?",
    [order_number, id]
  );
};

exports.updateStatus = async (id, status) => {
  await db.query("UPDATE orders SET status=? WHERE id=?", [status, id]);
};

exports.getQueue = async () => {
  const [rows] = await db.query(
    "SELECT id, order_number, status FROM orders WHERE status='validated' ORDER BY order_number ASC"
  );
  return rows;
};
