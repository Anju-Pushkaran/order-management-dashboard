using System.Text.Json;
using System.Text.Json.Serialization;
using OrderApi.Models;

namespace OrderApi.Data;

public class JsonOrderRepository : IOrderRepository
{
    private readonly List<Order> _orders;
    private readonly object _lock = new();

    public JsonOrderRepository(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "orders.json");
        var json = File.ReadAllText(path);

        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        options.Converters.Add(new JsonStringEnumConverter());
        _orders = JsonSerializer.Deserialize<List<Order>>(json, options) ?? new List<Order>();
    }

    public IReadOnlyList<Order> GetAll()
    {
        lock (_lock)
        {
            return _orders.ToList();
        }
    }

    public Order? GetById(string id)
    {
        lock (_lock)
        {
            return _orders.FirstOrDefault(o =>
                string.Equals(o.Id, id, StringComparison.OrdinalIgnoreCase));
        }
    }

    public void Update(Order order)
    {
        lock (_lock)
        {
            var index = _orders.FindIndex(o => o.Id == order.Id);
            if (index >= 0)
            {
                _orders[index] = order;
            }
        }
    }
}
