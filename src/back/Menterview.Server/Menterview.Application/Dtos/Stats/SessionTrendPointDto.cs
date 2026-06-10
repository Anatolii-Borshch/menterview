namespace Menterview.Application.Dtos.Stats;

public class SessionTrendPointDto
{
    public long SessionId { get; set; }
    public DateTime Time { get; set; }
    public double AverageAccuracy { get; set; }
    public int TotalTime { get; set; }
    public int AnsweredCount { get; set; }
}