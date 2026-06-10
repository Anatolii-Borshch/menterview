using Menterview.Application.Dtos.Sub;

namespace Menterview.Api.Models.Question;

public class QuestionListItemResponse
{
    public long QuestionId { get; set; }
    public string Question { get; set; } = null!;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public int DifficultyId { get; set; }
    public string DifficultyName { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
}