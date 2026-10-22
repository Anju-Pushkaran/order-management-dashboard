using OrderApi.Models;

namespace OrderApi.Services;

public interface IOrderService
{
    IReadOnlyList<Order> GetAllOrders();
    Order? GetOrderById(string id);
    UpdateStatusResult UpdateStatus(string id, OrderStatus newStatus);
}