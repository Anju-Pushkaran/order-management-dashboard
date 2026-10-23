import { useEffect, useState } from "react";
import { getOrders } from "./api/ordersApi";
import OrderTable from "./components/OrderTable";
import type { Order } from "./types/order";
import SearchFilterBar from "./components/SearchFilterBar";
import { filterOrders, type StatusFilter } from "./utils/filterOrders";
import OrderDetailsModal from "./components/OrderDetailsModal";

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const filteredOrders = filterOrders(orders, searchText, statusFilter);

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

      {!isLoading && !error && (
        <>
          <SearchFilterBar
            searchText={searchText}
            statusFilter={statusFilter}
            onSearchChange={setSearchText}
            onStatusChange={setStatusFilter}
          />
          <p>
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <OrderTable
            orders={filteredOrders}
            onViewDetails={setSelectedOrderId}
          />
        </>
      )}
      {selectedOrderId && (
        <OrderDetailsModal
          key={selectedOrderId}
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </main>
  );
}

export default App;
