namespace Menterview.Api.Models.Sessions;

public class GetSessionsQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}