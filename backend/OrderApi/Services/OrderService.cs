using OrderApi.Data;
using OrderApi.Models;

namespace OrderApi.Services;

public class OrderService : IOrderService
{
    private static readonly Dictionary<OrderStatus, OrderStatus[]> AllowedTransitions = new()
    {
        [OrderStatus.Pending] = new[] { OrderStatus.Processing, OrderStatus.Cancelled },
        [OrderStatus.Processing] = new[] { OrderStatus.Completed, OrderStatus.Cancelled },
        [OrderStatus.Completed] = Array.Empty<OrderStatus>(),
        [OrderStatus.Cancelled] = Array.Empty<OrderStatus>()
    };

    private readonly IOrderRepository _repository;

    private OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }

    public IReadOnlyList<Order> GetAllOrders() => _repository.GetAll();

    public Order? GetOrderById(string id) => _repository.GetById(id);

    public UpdateStatusResult UpdateStatus(string id, OrderStatus newStatus)
    {
        var order = _repository.GetById(id);
        if (order is null)
        {
            return UpdateStatusResult.NotFound(id);
        }

        if (order.Status is OrderStatus.Completed or OrderStatus.Cancelled)
        {
            return UpdateStatusResult.InvalidTransition(
                $"Order '{order.Id}' is {order.Status} and can no longer be changed.");
        }

        if (!CanTransition(order.Status, newStatus))
        {
            return UpdateStatusResult.InvalidTransition(
                $"Cannot change status from {order.Status} to {newStatus}.");
        }

        order.Status = newStatus;
        _repository.Update(order);
        return UpdateStatusResult.Success(order);
    }

    public static bool CanTransition(OrderStatus from, OrderStatus to) =>
        AllowedTransitions.TryGetValue(from, out var allowed) && allowed.Contains(to);
}