namespace Menterview.Domain.Entities;

public class NewQuestionTag
{
    public long NewQuestionTagId { get; set; }
    public long SuggestionId { get; set; }
    public NewQuestion NewQuestion { get; set; } = null!;
    public int TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}