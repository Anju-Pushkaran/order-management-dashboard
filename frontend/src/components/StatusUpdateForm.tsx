import { useState } from "react";
import type { FormEvent } from "react";
import { updateOrderStatus } from "../api/ordersApi";
import type { Order, OrderStatus } from "../types/order";
import { getAllowedNextStatuses } from "../utils/statusTransitions";
import "./StatusUpdateForm.css";

interface StatusUpdateFormProps {
  order: Order;
  onStatusUpdated: (updatedOrder: Order) => void;
}

function StatusUpdateForm({ order, onStatusUpdated }: StatusUpdateFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const allowedStatuses = getAllowedNextStatuses(order.status);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedStatus === "") {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedOrder = await updateOrderStatus(order.id, selectedStatus);
      setSelectedStatus("");
      setSuccessMessage(`Status updated to ${updatedOrder.status}.`);
      onStatusUpdated(updatedOrder);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update the status.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="status-update">
      <h3>Update status</h3>

      {allowedStatuses.length === 0 ? (
        <p className="status-locked">
          This order is {order.status} and can no longer be changed.
        </p>
      ) : (
        <form className="status-update-form" onSubmit={handleSubmit}>
          <label className="status-update-field">
            <span>New status</span>
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value as OrderStatus | "")
              }
              disabled={isSaving}
            >
              <option value="">Select a status</option>
              {allowedStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={selectedStatus === "" || isSaving}>
            {isSaving ? "Saving..." : "Update status"}
          </button>
        </form>
      )}

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {successMessage && (
        <p role="status" className="form-success">
          {successMessage}
        </p>
      )}
    </section>
  );
}

export default StatusUpdateForm;
