namespace Menterview.Application.Models.Auth;

public class LoggedUserCredentials
{
    public long UserId { get; set; }
    public string Token { get; set; } = null!;
}