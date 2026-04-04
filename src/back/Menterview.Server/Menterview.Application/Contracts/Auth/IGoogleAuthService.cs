using Menterview.Application.Models.Auth;

namespace Menterview.Application.Contracts.Auth;

public interface IGoogleAuthService
{
    Task<GoogleUserInfo?> ValidateIdTokenAsync(string idToken, CancellationToken ct = default);
}