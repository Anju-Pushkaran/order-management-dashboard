import type { KeyboardEvent } from "react";
import type { Order } from "../types/order";
import { formatCurrency, formatDate } from "../utils/format";
import StatusBadge from "./StatusBadge";
import "./OrderTable.css";

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (orderId: string) => void;
}

function OrderTable({ orders, onViewDetails }: OrderTableProps) {
  if (orders.length === 0) {
    return <p className="empty-message">No orders found.</p>;
  }

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    orderId: string,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onViewDetails(orderId);
    }
  }

  return (
    <div className="table-wrapper">
      <table className="order-table">
        <caption className="table-hint">
          Select an order to view its details.
        </caption>
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Order Date</th>
            <th scope="col">Status</th>
            <th scope="col" className="numeric">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="clickable-row"
              tabIndex={0}
              aria-label={`View details for order ${order.id}`}
              onClick={() => onViewDetails(order.id)}
              onKeyDown={(event) => handleRowKeyDown(event, order.id)}
            >
              <td>{order.id}</td>
              <td>{order.customerName}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td className="numeric">{formatCurrency(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
