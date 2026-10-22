export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Completed', 'Cancelled'];

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export interface ProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
}