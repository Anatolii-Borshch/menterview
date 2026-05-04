namespace Menterview.Api.Models.User;

public class GetUsersQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SearchTerm { get; set; }
    public int? RoleId { get; set; }
}
