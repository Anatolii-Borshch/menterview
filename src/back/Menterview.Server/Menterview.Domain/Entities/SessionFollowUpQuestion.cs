namespace Menterview.Domain.Entities;

public class SessionFollowUpQuestion
{
    public long FollowUpQuestionId { get; set; }

    public string QuestionText { get; set; } = null!;
    public string Answer { get; set; } = null!;

    public long SessionId { get; set; }
    public SessionStory Session { get; set; } = null!;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int DifficultyId { get; set; }
    public Difficulty Difficulty { get; set; } = null!;
}
