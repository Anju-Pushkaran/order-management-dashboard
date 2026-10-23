import { useEffect, useState } from "react";
import { getOrders } from "./api/ordersApi";
import OrderTable from "./components/OrderTable";
import type { Order } from "./types/order";
import SearchFilterBar from "./components/SearchFilterBar";
import { filterOrders, type StatusFilter } from "./utils/filterOrders";
import OrderDetailsModal from "./components/OrderDetailsModal";
import SummaryCards from "./components/SummaryCards";
import "./App.css";

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
  function handleOrderUpdated(updatedOrder: Order) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Order Management Dashboard</h1>
        <p className="app-subtitle">Veterinary Purchasing – customer orders</p>
      </header>

      {isLoading && <p>Loading orders...</p>}

      {error && <p role="alert">{error}</p>}

      {!isLoading && !error && (
        <>
          <SummaryCards orders={orders} />
          <SearchFilterBar
            searchText={searchText}
            statusFilter={statusFilter}
            onSearchChange={setSearchText}
            onStatusChange={setStatusFilter}
          />
          <p className="result-count">
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
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </main>
  );
}

export default App;
