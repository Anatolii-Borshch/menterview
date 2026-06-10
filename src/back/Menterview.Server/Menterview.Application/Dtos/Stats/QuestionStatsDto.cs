namespace Menterview.Application.Dtos.Stats;

public class QuestionStatsDto
{
    public int TotalQuestions { get; set; }
    public int PendingApprovals { get; set; }
    public int RejectedCount { get; set; }
    public int DeletedCount { get; set; }
    public IEnumerable<StatsTrendPointDto> SubmissionTrend { get; set; } = [];
}