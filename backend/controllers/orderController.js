const orderModel = require("../models/orderModel");

let io;

exports.setSocket = (socketIo) => {
  io = socketIo;
};

exports.createOrder = async (req, res) => {
  try {
    const { menu_id } = req.body;
    const id = await orderModel.createOrder(menu_id);

    io.emit("newOrder", { id });

    res.json({ 
      id, 
      order_number: null,
      status: "pending",
      message: "Commande créée" 
    });
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await orderModel.getAllOrders();
  res.json(orders);
};

exports.validateOrder = async (req, res) => {
  try {
    const order_number = await orderModel.getNextOrderNumber();
    await orderModel.validateOrder(req.params.id, order_number);

    io.emit("orderUpdated", {
      id: Number(req.params.id),
      order_number: Number(order_number),
      status: "validated",
    });

    res.json({ message: "Commande validée", order_number });
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    res.status(500).json({ error: "Erreur lors de la validation" });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await orderModel.updateStatus(req.params.id, status);

    io.emit("orderUpdated", {
      id: parseInt(req.params.id),
      status,
    });

    res.json({ message: "Statut mis à jour" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};


exports.getQueue = async (req, res) => {
  try {
    const queue = await orderModel.getQueue();
    res.json(queue);
  } catch (error) {
    console.error("Erreur lors de la récupération de la queue:", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};
