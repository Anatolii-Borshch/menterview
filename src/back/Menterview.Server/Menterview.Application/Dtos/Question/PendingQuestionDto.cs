using Menterview.Domain.Enums;

namespace Menterview.Application.Dtos.Question;

public class PendingQuestionDto
{
    public long SuggestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public SuggestionType Type { get; set; }
    public SuggestionStatus Status { get; set; }
    public Guid? SubmittedByUserId { get; set; }
    public string? SubmittedByName { get; set; }
    public DateTime CreatedAt { get; set; }
}