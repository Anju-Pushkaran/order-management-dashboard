using System.ComponentModel.DataAnnotations;

namespace OrderApi.Models;

public class UpdateStatusRequest
{
    [Required(ErrorMessage = "Status is required.")]
    public OrderStatus? Status { get; set; }
}