using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Admin;

public class AdminUserDetailsDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public RoleDto Role { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int TotalSessions { get; set; }
    public double OverallAverageAccuracy { get; set; }
}
