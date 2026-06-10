using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Session;

public class SessionQuestionDto
{
    public long QuestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string Answer { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
    public string? RephrasedText { get; set; }
    public bool IsWeakTopicReview { get; set; }
}