using Microsoft.AspNetCore.Mvc;
using OrderApi.Models;
using OrderApi.Services;

namespace OrderApi.Controllers;

[ApiController]
[Route("orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public ActionResult<IReadOnlyList<Order>> GetAll()
    {
        return Ok(_orderService.GetAllOrders());
    }

    [HttpGet("{id}")]
    public ActionResult<Order> GetById(string id)
    {
        var order = _orderService.GetOrderById(id);
        if (order is null)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Order not found",
                detail: $"Order '{id}' was not found.");
        }

        return Ok(order);
    }

    [HttpPatch("{id}")]
    public ActionResult<Order> UpdateStatus(string id, [FromBody] UpdateStatusRequest request)

    { 
        var result = _orderService.UpdateStatus(id, request.Status!.Value);

        if (result.Outcome == UpdateStatusOutcome.Success)
        {
            return Ok(result.Order);
        }

        if (result.Outcome == UpdateStatusOutcome.NotFound)
        {
            return Problem(
                statusCode: StatusCodes.Status404NotFound,
                title: "Order not found",
                detail: result.ErrorMessage);
        }

        return Problem(
            statusCode: StatusCodes.Status400BadRequest,
            title: "Invalid status change",
            detail: result.ErrorMessage);
    }
}