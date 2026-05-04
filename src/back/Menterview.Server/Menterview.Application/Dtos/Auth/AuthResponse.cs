namespace Menterview.Application.Dtos.Auth;

public class AuthResponse
{
    public Guid UserId { get; set; }
    public string AccessToken  { get; set; } 
    public string RefreshToken  { get; set; } 
    public DateTime ExpiresAt { get; set; }
}   