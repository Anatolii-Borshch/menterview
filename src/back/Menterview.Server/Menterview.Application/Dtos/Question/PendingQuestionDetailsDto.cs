using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Question;

public class PendingQuestionDetailsDto : PendingQuestionDto
{
    public string Answer { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
    public QuestionDetailsDto? OriginalQuestion { get; set; }
}