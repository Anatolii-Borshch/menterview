namespace Menterview.Application.Models.Application;

public record CreateUserRequest(
    string Email,
    string? Password,
    string FirstName,
    string LastName,
    int CategoryId,
    int? LevelId = null,
    IReadOnlyList<int>? TagIds = null,
    string? ExternalProvider = null,
    string? ExternalId = null
);