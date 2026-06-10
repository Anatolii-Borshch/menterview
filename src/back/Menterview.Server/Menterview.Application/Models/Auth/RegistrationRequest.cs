namespace Menterview.Application.Models.Auth;

public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    int CategoryId,
    int? LevelId = null
);