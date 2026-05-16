using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Admin;

public class AdminUserListItemDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public RoleDto Role { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
