using OrderApi.Data;
using OrderApi.Models;
using OrderApi.Services;

namespace OrderApi.Tests;

public class OrderServiceTests
{
    [Theory]
    [InlineData(OrderStatus.Pending, OrderStatus.Processing)]
    [InlineData(OrderStatus.Pending, OrderStatus.Cancelled)]
    [InlineData(OrderStatus.Processing, OrderStatus.Completed)]
    [InlineData(OrderStatus.Processing, OrderStatus.Cancelled)]
    public void UpdateStatus_AllowedTransition_UpdatesOrder(OrderStatus currentStatus, OrderStatus newStatus)
    {
        var repository = new FakeOrderRepository(CreateOrder("ORD-1", currentStatus));
        var service = new OrderService(repository);

        var result = service.UpdateStatus("ORD-1", newStatus);

        Assert.Equal(UpdateStatusOutcome.Success, result.Outcome);
        Assert.Equal(newStatus, repository.GetById("ORD-1")!.Status);
    }

    [Theory]
    [InlineData(OrderStatus.Pending, OrderStatus.Completed)]
    [InlineData(OrderStatus.Pending, OrderStatus.Pending)]
    [InlineData(OrderStatus.Processing, OrderStatus.Pending)]
    public void UpdateStatus_TransitionNotAllowed_ReturnsInvalidTransition(OrderStatus currentStatus, OrderStatus newStatus)
    {
        var repository = new FakeOrderRepository(CreateOrder("ORD-1", currentStatus));
        var service = new OrderService(repository);

        var result = service.UpdateStatus("ORD-1", newStatus);

        Assert.Equal(UpdateStatusOutcome.InvalidTransition, result.Outcome);
        Assert.Equal(currentStatus, repository.GetById("ORD-1")!.Status);
    }

    [Theory]
    [InlineData(OrderStatus.Completed)]
    [InlineData(OrderStatus.Cancelled)]
    public void UpdateStatus_CompletedOrCancelledOrder_CannotBeChanged(OrderStatus finalStatus)
    {
        var repository = new FakeOrderRepository(CreateOrder("ORD-1", finalStatus));
        var service = new OrderService(repository);

        var result = service.UpdateStatus("ORD-1", OrderStatus.Processing);

        Assert.Equal(UpdateStatusOutcome.InvalidTransition, result.Outcome);
        Assert.Contains("can no longer be changed", result.ErrorMessage);
        Assert.Equal(finalStatus, repository.GetById("ORD-1")!.Status);
    }

    [Fact]
    public void UpdateStatus_UnknownOrder_ReturnsNotFound()
    {
        var repository = new FakeOrderRepository();
        var service = new OrderService(repository);

        var result = service.UpdateStatus("ORD-404", OrderStatus.Processing);

        Assert.Equal(UpdateStatusOutcome.NotFound, result.Outcome);
    }

    private static Order CreateOrder(string id, OrderStatus status) => new()
    {
        Id = id,
        CustomerName = "Test Clinic",
        OrderDate = new DateOnly(2026, 10, 15),
        Status = status
    };

    private sealed class FakeOrderRepository : IOrderRepository
    {
        private readonly List<Order> _orders;

        public FakeOrderRepository(params Order[] orders)
        {
            _orders = orders.ToList();
        }

        public IReadOnlyList<Order> GetAll() => _orders.ToList();

        public Order? GetById(string id) => _orders.FirstOrDefault(o => o.Id == id);

        public void Update(Order order)
        {
            var index = _orders.FindIndex(o => o.Id == order.Id);
            if (index >= 0)
            {
                _orders[index] = order;
            }
        }
    }
}