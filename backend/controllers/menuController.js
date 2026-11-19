const menuModel = require("../models/menuModel");

exports.getMenus = async (req, res) => {
  const menus = await menuModel.getAllMenus();
  res.json(menus);
};

exports.createMenu = async (req, res) => {
  await menuModel.createMenu(req.body);
  res.json({ message: "Menu créé" });
};

exports.updateMenu = async (req, res) => {
  await menuModel.updateMenu(req.params.id, req.body);
  res.json({ message: "Menu modifié" });
};

exports.deleteMenu = async (req, res) => {
  await menuModel.deleteMenu(req.params.id);
  res.json({ message: "Menu supprimé" });
};