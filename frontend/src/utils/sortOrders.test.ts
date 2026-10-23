import { describe, expect, it } from "vitest";
import type { Order } from "../types/order";
import { sortOrders } from "./sortOrders";

function createOrder(id: string, orderDate: string, total: number): Order {
  return { id, orderDate, total, customerName: "Test Clinic", status: "Pending", items: [] };
}

const orders: Order[] = [
  createOrder("ORD-A", "2026-10-15", 125.5),
  createOrder("ORD-B", "2026-10-05", 300),
  createOrder("ORD-C", "2026-10-20", 48),
];

function ids(result: Order[]): string[] {
  return result.map((order) => order.id);
}

describe("sortOrders", () => {
  it("sorts by order date, newest first", () => {
    expect(ids(sortOrders(orders, "date-desc"))).toEqual(["ORD-C", "ORD-A", "ORD-B"]);
  });

  it("sorts by order date, oldest first", () => {
    expect(ids(sortOrders(orders, "date-asc"))).toEqual(["ORD-B", "ORD-A", "ORD-C"]);
  });

  it("sorts by total, highest first", () => {
    expect(ids(sortOrders(orders, "total-desc"))).toEqual(["ORD-B", "ORD-A", "ORD-C"]);
  });

  it("sorts by total, lowest first", () => {
    expect(ids(sortOrders(orders, "total-asc"))).toEqual(["ORD-C", "ORD-A", "ORD-B"]);
  });

  it("does not change the original array", () => {
    sortOrders(orders, "total-asc");
    expect(ids(orders)).toEqual(["ORD-A", "ORD-B", "ORD-C"]);
  });
});