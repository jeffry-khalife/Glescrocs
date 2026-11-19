require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderController = require("./controllers/orderController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

orderController.setSocket(io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);

io.on("connection", (socket) => {
  console.log(`Client connecté: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client déconnecté: ${socket.id}`);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur le port ${process.env.PORT}`);
});