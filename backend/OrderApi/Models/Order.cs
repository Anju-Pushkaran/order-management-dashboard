namespace OrderApi.Models;

public class Order
{
    public string Id { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateOnly OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public decimal Total => Items.Sum(item => item.LineTotal);
}