namespace Menterview.Api.Models.Sessions;

public class GetSessionStatsQuery
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public int? LastN { get; set; } = 10;
}