import type { Order, OrderStatus, ProblemDetails } from '../types/order';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5172';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
  } catch {
    throw new ApiError('Unable to reach the server. Please check that the API is running.', 0);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const problem = (await response.json()) as ProblemDetails;
      message = problem.detail ?? problem.title ?? message;
    } catch {
      // Response body was not JSON, so keep the default message.
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export function getOrders(): Promise<Order[]> {
  return request<Order[]>('/orders');
}

export function getOrderById(id: string): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(id)}`);
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return request<Order>(`/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}