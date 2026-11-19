jest.mock("../../models/userModel", () => ({
  findByUsername: jest.fn(),
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
}));

jest.mock("../../models/orderModel", () => ({
  createOrder: jest.fn(),
  getAllOrders: jest.fn(),
  getNextOrderNumber: jest.fn(),
  validateOrder: jest.fn(),
  updateStatus: jest.fn(),
  getQueue: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel");
const orderModel = require("../../models/orderModel");
const authController = require("../../controllers/authController");
const orderController = require("../../controllers/orderController");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Fonctions métier du backend", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("refuse la création d'un utilisateur dont un champ est manquant", async () => {
    const req = { body: { username: "jean", password: "", role: "employee" } };
    const res = mockResponse();

    await authController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Tous les champs sont requis" });
  });

  test("crée un utilisateur avec un mot de passe haché", async () => {
    const req = { body: { username: "jean", password: "secret6", role: "employee" } };
    const res = mockResponse();
    userModel.findByUsername.mockResolvedValue(undefined);
    bcrypt.hash.mockResolvedValue("hashed-secret");

    await authController.createUser(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("secret6", 10);
    expect(userModel.createUser).toHaveBeenCalledWith("jean", "hashed-secret", "employee");
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur créé avec succès" });
  });

  test("retourne une erreur lorsque l'utilisateur est introuvable", async () => {
    const req = { body: { username: "inconnu", password: "secret6" } };
    const res = mockResponse();
    userModel.findByUsername.mockResolvedValue(undefined);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur introuvable" });
  });

  test("crée une commande en attente et émet un nouvel événement", async () => {
    const emit = jest.fn();
    orderController.setSocket({ emit });
    orderModel.createOrder.mockResolvedValue(42);
    const req = { body: { menu_id: 7 } };
    const res = mockResponse();

    await orderController.createOrder(req, res);

    expect(orderModel.createOrder).toHaveBeenCalledWith(7);
    expect(emit).toHaveBeenCalledWith("newOrder", { id: 42 });
    expect(res.json).toHaveBeenCalledWith({
      id: 42,
      order_number: null,
      status: "pending",
      message: "Commande créée",
    });
  });

  test("attribue le prochain numéro lors de la validation", async () => {
    const emit = jest.fn();
    orderController.setSocket({ emit });
    orderModel.getNextOrderNumber.mockResolvedValue(3);
    const req = { params: { id: "12" } };
    const res = mockResponse();

    await orderController.validateOrder(req, res);

    expect(orderModel.validateOrder).toHaveBeenCalledWith("12", 3);
    expect(emit).toHaveBeenCalledWith("orderUpdated", {
      id: 12,
      order_number: 3,
      status: "validated",
    });
  });
});
