using Menterview.Application.Dtos.Auth;
using Menterview.Application.Models.Auth;

namespace Menterview.Application.Contracts.Auth;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task VerifyEmailAsync(VerifyEmailRequest request, CancellationToken ct = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<AuthResponse> GoogleLoginAsync(GoogleUserInfo googleUser, int defaultCategoryId = 1, CancellationToken ct = default);
    Task LogoutAsync(LogoutRequest request, CancellationToken ct = default);
    Task<AuthResponse> RefreshAsync(RefreshTokenRequest request, CancellationToken ct = default);
}