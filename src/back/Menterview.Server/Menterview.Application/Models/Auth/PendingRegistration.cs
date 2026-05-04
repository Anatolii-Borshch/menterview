namespace Menterview.Application.Models.Auth;

public class PendingRegistration
{
    public RegisterRequest Request { get; set; } = null!;
    public string Code { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;
}