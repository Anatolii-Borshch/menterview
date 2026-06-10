namespace Menterview.Api.Models.Sessions;

public class StartSessionRequest
{
    public int? CategoryId { get; set; }
    public int? DifficultyId { get; set; }
    public IEnumerable<int> TagIds { get; set; } = [];
    public int QuestionsAmount { get; set; } = 10;
    public float WeakTopicRatio { get; set; } = 0.3f;
}