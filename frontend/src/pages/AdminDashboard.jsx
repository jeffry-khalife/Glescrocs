import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import { getMenus } from "../api/api";
import MenusManagement from "../components/MenusManagement";
import UsersManagement from "../components/UsersManagement";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (err) {
      console.error("Error fetching menus:", err);
    }
  };

  const validateOrder = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${id}/validate`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      fetchOrders();
    } catch (err) {
      console.error("Error validating order:", err);
    }
  };

  const markReady = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ status: "ready" }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error marking as ready:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  useEffect(() => {
    fetchOrders();
    fetchMenus();

    const handleUpdate = () => {
      fetchOrders();
    };

    socket.on("newOrder", handleUpdate);
    socket.on("orderUpdated", handleUpdate);

    return () => {
      socket.off("newOrder", handleUpdate);
      socket.off("orderUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div className="admin-header-container">
          <h1 className="admin-dashboard-title">Admin Dashboard</h1>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="admin-dashboard-container">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Commandes
          </button>
          <button
            className={`admin-tab ${activeTab === "menus" ? "active" : ""}`}
            onClick={() => setActiveTab("menus")}
          >
            Menus
          </button>
          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Utilisateurs
          </button>
        </div>

        {activeTab === "orders" && (
          <div className="admin-tab-content">
            {loading ? (
              <div className="admin-loading">
                <p>Chargement</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="admin-orders-grid">
                {orders.map((order) => (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-header">
                      <span className="admin-order-id">
                        Commande #{order.order_number || order.id}
                      </span>
                      <span
                        className={`admin-order-status admin-status-${order.status}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="admin-order-details">
                      <p>
                        <strong>ID:</strong> {order.id}
                      </p>
                      <p>
                        <strong>Menu ID:</strong> {order.menu_id}
                      </p>
                      <p>
                        <strong>Creer:</strong>{" "}
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="admin-order-actions">
                      {order.status === "pending" && (
                        <button
                          className="admin-action-btn admin-btn-validate"
                          onClick={() => validateOrder(order.id)}
                        >
                          Valider
                        </button>
                      )}
                      {order.status === "validated" && (
                        <button
                          className="admin-action-btn admin-btn-ready"
                          onClick={() => markReady(order.id)}
                        >
                          Marquer prêt
                        </button>
                      )}
                      {order.status === "ready" && (
                        <span className="admin-status-badge">✓ Prête</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <p>Aucune commande pour le moment</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "menus" && (
          <div className="admin-tab-content">
            <MenusManagement menus={menus} onMenusUpdate={fetchMenus} />
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-tab-content">
            <UsersManagement />
          </div>
        )}
      </div>
    </div>
  );
}