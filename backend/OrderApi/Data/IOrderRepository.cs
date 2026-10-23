using OrderApi.Models;

namespace OrderApi.Data;

public interface IOrderRepository
{
    IReadOnlyList<Order> GetAll();
    Order? GetById(string id);
    void Update(Order order);
}
