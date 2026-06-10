namespace Menterview.Application.Models.Auth;

public record VerifyEmailRequest(string Email, string Code);