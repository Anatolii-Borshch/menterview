namespace Menterview.Application.Dtos.Auth;

public class RefreshTokenResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryTime { get; set; }
}