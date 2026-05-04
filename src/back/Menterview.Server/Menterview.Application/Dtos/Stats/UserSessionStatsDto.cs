namespace Menterview.Application.Dtos.Stats;

public class UserSessionStatsDto
{
    public IEnumerable<SessionTrendPointDto> Trend { get; set; } = [];
    public double OverallAverageAccuracy { get; set; }
    public double OverallAverageTime { get; set; }
    public int TotalSessionsCount { get; set; }
}
