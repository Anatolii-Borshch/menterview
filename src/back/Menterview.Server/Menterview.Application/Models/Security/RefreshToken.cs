namespace Menterview.Application.Models.Security;

public class RefreshToken
{
    public long Id { get; set; }
    public string Token { get; set; } = null!;
    public string IdentityUserId { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public bool IsRevoked => RevokedAt.HasValue;
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired;
}