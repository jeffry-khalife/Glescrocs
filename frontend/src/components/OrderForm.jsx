import { useState, useEffect } from "react";
import { createOrder } from "../api/api";
import socket from "../socket";


export default function OrderForm({ menuId }) {
  const [order, setOrder] = useState(null);

  const handleOrder = async () => {
    const res = await createOrder(menuId);

    localStorage.setItem("myOrderId", res.id);
    setOrder({
      id: res.id,
      status: "pending",
      order_number: null
    });
  };

  useEffect(() => {
    const handleUpdate = (data) => {
      setOrder((prev) => {
        if (!prev) return prev;
        if (data.id !== prev.id) return prev;

        return { ...prev, ...data };
      });
    };

    socket.on("orderUpdated", handleUpdate);

    return () => {
      socket.off("orderUpdated", handleUpdate);
    };
  }, []);

  return (
    <div>
      <button onClick={handleOrder}>Confirmer la commande</button>

      {order && (
        <div>
          <p>Status : {order.status}</p>
          <p>
            Numéro : {order.order_number
              ? order.order_number
              : "En attente de validation"}
          </p>
        </div>
      )}
    </div>
  );
}
