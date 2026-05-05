using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.WeakPoint;

public class WeakTopicDto
{
    public long WeakTopicId { get; set; }
    public long OriginalQuestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? RephrasedQuestion { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
    public int RepeatCount { get; set; }
    public float EaseFactor { get; set; }
    public DateTime NextReviewAt { get; set; }
    public int LastAccuracy { get; set; }
}