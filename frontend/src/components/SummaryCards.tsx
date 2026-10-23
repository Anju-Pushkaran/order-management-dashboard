import { ORDER_STATUSES } from "../types/order";
import type { Order } from "../types/order";
import "./SummaryCards.css";

interface SummaryCardsProps {
  orders: Order[];
}

function SummaryCards({ orders }: SummaryCardsProps) {
  const cards = [
    { label: "Total orders", count: orders.length, className: "summary-total" },
    ...ORDER_STATUSES.map((status) => ({
      label: status,
      count: orders.filter((order) => order.status === status).length,
      className: `summary-${status.toLowerCase()}`,
    })),
  ];

  return (
    <section className="summary-cards" aria-label="Order summary">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.className}`}>
          <span className="summary-count">{card.count}</span>
          <span className="summary-label">{card.label}</span>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;
