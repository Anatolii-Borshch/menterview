using Menterview.Domain.Entities;

namespace Menterview.Application.Models.Application;

public class User
{
    public Guid UserId { get; set; }
    
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string EmailAddress { get; set; } = null!;
    public DateTime CreatedAt { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int DifficultyId { get; set; }
    public Difficulty Difficulty { get; set; } = null!;

    public int? LevelId { get; set; }
    public Level? Level { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public IReadOnlyList<Tag> SkillTags { get; set; } = [];

    public Setting Setting { get; set; } = null!;
    public ICollection<SessionStory> Sessions { get; set; } = new List<SessionStory>();
    public ICollection<NewQuestion> SuggestedQuestions { get; set; } = new List<NewQuestion>();

    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}