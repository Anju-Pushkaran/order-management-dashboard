import { useEffect, useState } from "react";
import { getOrderById } from "../api/ordersApi";
import type { Order } from "../types/order";
import { formatCurrency, formatDate } from "../utils/format";
import StatusBadge from "./StatusBadge";
import "./OrderDetailsModal.css";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
}

function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      try {
        const data = await getOrderById(orderId);
        if (!ignore) {
          setOrder(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      ignore = true;
    };
  }, [orderId]);

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
      >
        <div className="modal-header">
          <h2 id="order-details-title">Order {orderId}</h2>
          <button type="button" onClick={onClose}>
            Back to orders
          </button>
        </div>

        {isLoading && <p>Loading order details...</p>}

        {error && <p role="alert">{error}</p>}

        {order && (
          <>
            <dl className="order-summary">
              <dt>Customer</dt>
              <dd>{order.customerName}</dd>
              <dt>Order date</dt>
              <dd>{formatDate(order.orderDate)}</dd>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={order.status} />
              </dd>
            </dl>

            <div className="items-wrapper">
              <table className="items-table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col" className="numeric">
                      Quantity
                    </th>
                    <th scope="col" className="numeric">
                      Unit price
                    </th>
                    <th scope="col" className="numeric">
                      Line total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td className="numeric">{item.quantity}</td>
                      <td className="numeric">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="numeric">
                        {formatCurrency(item.lineTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" colSpan={3}>
                      Order total
                    </th>
                    <td className="numeric">{formatCurrency(order.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsModal;
