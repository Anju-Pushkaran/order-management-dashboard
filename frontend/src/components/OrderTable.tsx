import type { Order } from "../types/order";
import { formatCurrency, formatDate } from "../utils/format";
import StatusBadge from "./StatusBadge";
import "./OrderTable.css";

interface OrderTableProps {
  orders: Order[];
}

function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return <p className="empty-message">No orders found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="order-table">
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
            <tr key={order.id}>
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
