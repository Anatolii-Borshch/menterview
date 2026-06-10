using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Answers;

public class AnswerBreakdownDto
{
    public long AnswerId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? RephrasedText { get; set; }
    public bool WasRephrased { get; set; }
    public bool WasWeakTopicReview { get; set; }
    public string AnswerText { get; set; } = null!;
    public string AiReply { get; set; } = null!;
    public int Accuracy { get; set; }
    public int AnsweringTime { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
}