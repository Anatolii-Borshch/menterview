using Menterview.Domain.Enums;

namespace Menterview.Api.Models.Question;

public class GetPendingQuestionsQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public SuggestionType? Type { get; set; }
}