using OrderApi.Models;

namespace OrderApi.Services;

public enum UpdateStatusOutcome
{
    Success,
    NotFound,
    InvalidTransition
}

public class UpdateStatusResult
{
    public UpdateStatusOutcome Outcome { get; }
    public Order? Order { get; }
    public string? ErrorMessage { get; }

    public UpdateStatusResult(UpdateStatusOutcome outcome, Order? order, string? errorMessage)
	{
        Outcome = outcome;
        Order = order;
        ErrorMessage = errorMessage;
    }

    public static UpdateStatusResult Success(Order order) =>
       new(UpdateStatusOutcome.Success, order, null);

    public static UpdateStatusResult NotFound(string id) =>
        new(UpdateStatusOutcome.NotFound, null, $"Order '{id}' was not found.");

    public static UpdateStatusResult InvalidTransition(string message) =>
        new(UpdateStatusOutcome.InvalidTransition, null, message);
}
