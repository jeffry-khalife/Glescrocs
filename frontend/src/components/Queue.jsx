import React, { useEffect, useState } from "react";
import { getQueue } from "../api/api";
import socket from "../socket";
import Notification from "./Notification";
import "../styles/Queue.css";

export default function Queue() {
  const [queue, setQueue] = useState([]);
  const [notification, setNotification] = useState(null);
  const myOrderId = localStorage.getItem("myOrderId");
  const myOrderPosition = queue.findIndex((order) => order.id == myOrderId);
  const clientsAhead = myOrderPosition > 0 ? myOrderPosition : 0;

  // Charger la file d'attente depuis l'API
  const loadQueue = async () => {
    try {
      const data = await getQueue();
      setQueue(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la queue:", error);
    }
  };

  // Effet pour charger la queue au montage et mettre en place les listeners Socket.io
  useEffect(() => {
    loadQueue();

    // Écouteur direct pour les mises à jour des commandes
    const handleOrderUpdated = (data) => {
      // Vérifier si c'est la commande de cet utilisateur et qu'elle est "ready"
      if (data.id == myOrderId && data.status === "ready") {
        setNotification({
          message: "🎉 Votre commande est prête! Venez la récupérer!",
          type: "success",
        });
      }
      // Recharger la queue de toute façon
      loadQueue();
    };

    const handleNewOrder = () => {
      loadQueue();
    };

    socket.on("orderUpdated", handleOrderUpdated);
    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("orderUpdated", handleOrderUpdated);
      socket.off("newOrder", handleNewOrder);
    };
  }, [myOrderId]);

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          autoClose={5000}
        />
      )}

      <section className="queue-section">
        <div className="queue-container">
          <h2 className="queue-title">File d'attente</h2>

          {myOrderPosition >= 0 ? (
            <div className="queue-position-display">
              <div className="position-big">
                <p className="position-label">Position</p>
                <p className="position-number-big">{myOrderPosition + 1}</p>
              </div>
              <div className="clients-ahead">
                <p className="clients-ahead-label">Nombre de clients avant vous</p>
                <p className="clients-ahead-number">{clientsAhead}</p>
              </div>
            </div>
          ) : (
            <div className="queue-empty">
              <p>Aucune commande trouvée</p>
            </div>
          )}

          {/* {queue.length > 0 && (
            <div className="queue-info">
              <p className="queue-info-text">Total in queue: {queue.length}</p>
            </div>
          )} */}
        </div>
      </section>
    </>
  );
}