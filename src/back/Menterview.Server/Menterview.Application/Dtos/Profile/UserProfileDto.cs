using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Profile;

public class UserProfileDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public DifficultyDto Difficulty { get; set; } = null!;
    public LevelDto? Level { get; set; }
    public RoleDto Role { get; set; } = null!;
    public UserSettingsDto? Settings { get; set; }
}

public class UserSettingsDto
{
    public ThemeDto Theme { get; set; } = null!;
    public LanguageDto Language { get; set; } = null!;
    public CountryDto Country { get; set; } = null!;
}
