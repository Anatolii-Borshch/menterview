namespace Menterview.Api.Models.Question;

public class UpdateSuggestionTagsRequest
{
    public IEnumerable<int> TagIds { get; set; } = [];
}
