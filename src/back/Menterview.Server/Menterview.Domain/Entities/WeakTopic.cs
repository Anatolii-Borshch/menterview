namespace Menterview.Domain.Entities;

public class WeakTopic
{
    public long WeakTopicId { get; set; }

    public Guid UserId { get; set; }
    public BusinessUser User { get; set; } = null!;

    public int? TagId { get; set; }
    public Tag? Tag { get; set; }

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    public int DifficultyId { get; set; }
    public Difficulty Difficulty { get; set; } = null!;

    public float EaseFactor { get; set; } = 2.5f;
    public int RepeatCount { get; set; }
    public int Interval { get; set; } = 1;
    public DateTime NextReviewAt { get; set; }

    public string? RephrasedQuestion { get; set; }
    public long? OriginalQuestionId { get; set; }
    public Question? OriginalQuestion { get; set; }
}