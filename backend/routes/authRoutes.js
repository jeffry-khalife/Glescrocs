const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", authController.login);
router.post("/users", verifyToken, authController.createUser);
router.get("/users", verifyToken, authController.getUsers);

module.exports = router;