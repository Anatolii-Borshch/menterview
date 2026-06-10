using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Session;

public class AnswerBreakdownDto
{
    public long AnswerId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? RephrasedText { get; set; }
    public string AnswerText { get; set; } = null!;
    public string AiReply { get; set; } = null!;
    public int Accuracy { get; set; }
    public int? Correctness { get; set; }
    public int? Completeness { get; set; }
    public int AnsweringTime { get; set; }
    public bool WasRephrased { get; set; }
    public bool WasWeakTopicReview { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
}