using Menterview.Application.Dtos.Sub;

namespace Menterview.Api.Models.User;

public class UserProfileDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public CategoryDto Category { get; set; } = null!;
    public RoleDto Role { get; set; } = null!;
    public UserSettingsDto Settings { get; set; } = null!;
}