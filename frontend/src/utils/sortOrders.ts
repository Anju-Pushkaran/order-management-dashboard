import type { Order } from "../types/order";

export type SortOption = "date-desc" | "date-asc" | "total-desc" | "total-asc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Order date (newest first)" },
  { value: "date-asc", label: "Order date (oldest first)" },
  { value: "total-desc", label: "Total (highest first)" },
  { value: "total-asc", label: "Total (lowest first)" },
];

export function sortOrders(orders: Order[], sortOption: SortOption): Order[] {
  return [...orders].sort((a, b) => {
    switch (sortOption) {
      case "date-asc":
        return a.orderDate.localeCompare(b.orderDate);
      case "date-desc":
        return b.orderDate.localeCompare(a.orderDate);
      case "total-asc":
        return a.total - b.total;
      case "total-desc":
        return b.total - a.total;
    }
  });
}