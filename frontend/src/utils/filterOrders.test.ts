import { describe, expect, it } from "vitest";
import type { Order, OrderStatus } from "../types/order";
import { filterOrders } from "./filterOrders";

function createOrder(id: string, customerName: string, status: OrderStatus): Order {
  return { id, customerName, status, orderDate: "2026-10-15", items: [], total: 0 };
}

const orders: Order[] = [
  createOrder("ORD-1001", "Riverside Veterinary Clinic", "Pending"),
  createOrder("ORD-1002", "Pinecrest Animal Hospital", "Processing"),
  createOrder("ORD-1003", "Riverside Veterinary Clinic", "Completed"),
];

function ids(result: Order[]): string[] {
  return result.map((order) => order.id);
}

describe("filterOrders", () => {
  it("returns all orders when search is empty and status is All", () => {
    expect(ids(filterOrders(orders, "", "All"))).toEqual(["ORD-1001", "ORD-1002", "ORD-1003"]);
  });

  it("finds an order by part of its ID", () => {
    expect(ids(filterOrders(orders, "1002", "All"))).toEqual(["ORD-1002"]);
  });

  it("finds orders by customer name, ignoring case and extra spaces", () => {
    expect(ids(filterOrders(orders, "  RIVERSIDE ", "All"))).toEqual(["ORD-1001", "ORD-1003"]);
  });

  it("filters by status", () => {
    expect(ids(filterOrders(orders, "", "Processing"))).toEqual(["ORD-1002"]);
  });

  it("applies search and status filter together", () => {
    expect(ids(filterOrders(orders, "riverside", "Completed"))).toEqual(["ORD-1003"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterOrders(orders, "zzz", "All")).toEqual([]);
  });
});