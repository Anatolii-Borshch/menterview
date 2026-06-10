namespace Menterview.Api.Models.Question;

public class AiGeneratedQuestionDto
{
    public string QuestionText { get; set; } = null!;
    public string Answer { get; set; } = null!;
    public int CategoryId { get; set; }
    public int DifficultyId { get; set; }
    public IEnumerable<int> TagIds { get; set; } = [];
}