namespace Menterview.Application.Dtos.Admin;

public class AdminUserDetailsDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string RoleName { get; set; } = null!;
    public string CategoryName { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int SessionCount { get; set; }
    public string? DifficultyName { get; set; }
    public string? LevelName { get; set; }
}
