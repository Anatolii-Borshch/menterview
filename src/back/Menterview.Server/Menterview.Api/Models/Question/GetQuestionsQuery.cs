namespace Menterview.Api.Models.Question;

public class GetQuestionsQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public int? CategoryId { get; set; }
    public int? DifficultyId { get; set; }
    public IEnumerable<int> TagIds { get; set; } = [];
    public string? SearchTerm { get; set; }
    public string? Search { get; set; }
}