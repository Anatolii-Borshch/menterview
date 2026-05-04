namespace Menterview.Application.Dtos.Stats;

public class SystemStatsDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalQuestions { get; set; }
    public int PendingApprovals { get; set; }
    public int TotalSessions { get; set; }
    public double GlobalAverageAccuracy { get; set; }
}