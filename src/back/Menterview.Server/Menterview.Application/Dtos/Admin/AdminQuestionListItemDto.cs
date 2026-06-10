
using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Admin;

public class AdminQuestionListItemDto
{
    public long QuestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public IEnumerable<TagDto> Tags { get; set; } = [];
    public bool IsDeleted { get; set; }
    public Guid? CreatedByUserId { get; set; }
    public string? CreatedByName { get; set; }
}