const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", orderController.createOrder);
router.get("/", verifyToken, orderController.getOrders);
router.put("/:id/validate", verifyToken, orderController.validateOrder);
router.put("/:id/status", verifyToken, orderController.updateStatus);
router.get("/queue", orderController.getQueue);

module.exports = router;