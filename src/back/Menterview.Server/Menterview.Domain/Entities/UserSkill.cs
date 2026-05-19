namespace Menterview.Domain.Entities;

public class UserSkill
{
    public Guid UserId { get; set; }
    public BusinessUser User { get; set; } = null!;

    public int TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}
