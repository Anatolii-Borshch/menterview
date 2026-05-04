namespace Menterview.Application.Dtos.Stats;

public class GlobalSessionStatsDto
{
    public int TotalSessions { get; set; }
    public double GlobalAverageAccuracy { get; set; }
    public double GlobalAverageTime { get; set; }
    public IEnumerable<StatsTrendPointDto> SessionTrend { get; set; } = [];
}