import type { Order, OrderStatus } from '../types/order';

export type StatusFilter = OrderStatus | 'All';
export function filterOrders(orders: Order[], searchText: string, statusFilter: StatusFilter): Order[] {
  const search = searchText.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesSearch =
      search === '' ||
      order.id.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search);

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}