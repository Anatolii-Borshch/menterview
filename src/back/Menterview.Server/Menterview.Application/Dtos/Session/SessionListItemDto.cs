
namespace Menterview.Application.Dtos.Session;

public class SessionListItemDto
{
    public long SessionId { get; set; }
    public DateTime Time { get; set; }
    public int QuestionsAmount { get; set; }
    public int AnsweredCount { get; set; }
    public int TotalTime { get; set; }
    public double AverageAccuracy { get; set; }
}