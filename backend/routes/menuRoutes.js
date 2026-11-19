const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", menuController.getMenus);
router.post("/", verifyToken, menuController.createMenu);
router.put("/:id", verifyToken, menuController.updateMenu);
router.delete("/:id", verifyToken, menuController.deleteMenu);

module.exports = router;