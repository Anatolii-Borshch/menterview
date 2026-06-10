using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Question;

public class QuestionListItemDto
{
    public long QuestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
}