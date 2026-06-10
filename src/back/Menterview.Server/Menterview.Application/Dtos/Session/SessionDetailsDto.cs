using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Session;

public class SessionDetailsDto
{
    public long SessionId { get; set; }
    public DateTime Time { get; set; }
    public int QuestionsAmount { get; set; }
    public int AnsweredCount { get; set; }
    public int TotalTime { get; set; }
    public double AverageAccuracy { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<AnswerBreakdownDto> Answers { get; set; } = [];
}