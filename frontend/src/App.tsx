import { useEffect, useState } from "react";
import { getOrders } from "./api/ordersApi";
import StatusBadge from "./components/StatusBadge";
import type { Order } from "./types/order";

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main>
      <h1>Order Management Dashboard</h1>
      <p>Veterinary Purchasing – customer orders</p>

      {isLoading && <p>Loading orders...</p>}

      {error && <p role="alert">{error}</p>}

      {!isLoading && !error && <p>{orders.length} orders loaded.</p>}

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.id} – {order.customerName} –{" "}
            <StatusBadge status={order.status} /> – {order.total}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
