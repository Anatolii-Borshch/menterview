using System.Text;
using Menterview.Application.Contracts.Auth;
using Menterview.Application.Contracts.Email;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Contracts.Security;
using Menterview.Application.Dtos.Auth;
using Menterview.Application.Models.Application;
using Menterview.Application.Models.Auth;
using Menterview.Application.Models.Email;
using Menterview.Application.Models.Security;
using Menterview.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Menterview.Identity.Services.Auth;

public class AuthService : IAuthService
{
    private const int RefreshTokenExpiryDays = 7;

    private static readonly Dictionary<string, PendingRegistration> _pendingRegistrations = new();
    private readonly IEmailService _emailService;
    private readonly IJwtTokenService _jwtService;
    private readonly IRefreshTokenRepository _refreshTokenRepo;
    private readonly FrontendSettings _frontendSettings;
    private readonly UserManager<AppIdentityUser> _userManager;
    private readonly IUserRepository _userRepo;

    public AuthService(
        IUserRepository userRepo,
        IRefreshTokenRepository refreshTokenRepo,
        IJwtTokenService jwtService,
        IEmailService emailService,
        UserManager<AppIdentityUser> userManager,
        IOptions<FrontendSettings> frontendSettings)
    {
        _userRepo = userRepo;
        _refreshTokenRepo = refreshTokenRepo;
        _jwtService = jwtService;
        _emailService = emailService;
        _userManager = userManager;
        _frontendSettings = frontendSettings.Value;
    }

    public async Task RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var existing = await _userRepo.GetByEmailAsync(request.Email, ct);
        if (existing is not null)
            throw new InvalidOperationException("Email already registered.");

        ValidatePassword(request.Password); 
        
        if (_pendingRegistrations.TryGetValue(request.Email, out var old) && !old.IsExpired)
            throw new InvalidOperationException("Verification code already sent. Please check your inbox.");
        
        var code = GenerateVerificationCode();

        _pendingRegistrations[request.Email] = new PendingRegistration
        {
            Request = request,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10)
        };

        await _emailService.SendEmailAsync(new EmailMessage
        {
            To = request.Email,
            Subject = "Your Menterview verification code",
            Body = BuildVerificationEmail(request.FirstName, code),
            IsBodyHtml = true
        });
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userRepo.GetByEmailAsync(request.Email, ct)
                   ?? throw new UnauthorizedAccessException("Invalid credentials.");

        var identityUser = await _userManager.FindByIdAsync(user.UserId.ToString())
                           ?? throw new UnauthorizedAccessException("Invalid credentials.");

        if (!await _userManager.CheckPasswordAsync(identityUser, request.Password))
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!identityUser.EmailConfirmed)
            throw new InvalidOperationException("Email not confirmed. Please check your inbox.");

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse> GoogleLoginAsync(GoogleUserInfo googleUser, int defaultCategoryId = 1,
        CancellationToken ct = default)
    {
        var existing = await _userRepo.GetByEmailAsync(googleUser.Email, ct);

        if (existing is not null)
            return await IssueTokensAsync(existing, ct);

        var user = await _userRepo.CreateAsync(new CreateUserRequest(
            Email: googleUser.Email,
            Password: null,
            FirstName: googleUser.FirstName ?? "User",
            LastName: googleUser.LastName ?? "",
            CategoryId: defaultCategoryId,
            ExternalProvider: "Google",
            ExternalId: googleUser.Sub
        ), ct);

        return await IssueTokensAsync(user, ct);
    }

    public async Task VerifyEmailAsync(VerifyEmailRequest request, CancellationToken ct = default)
    {
        if (!_pendingRegistrations.TryGetValue(request.Email, out var pending))
            throw new InvalidOperationException("No pending registration found for this email.");

        if (pending.IsExpired)
        {
            _pendingRegistrations.Remove(request.Email);
            throw new InvalidOperationException("Verification code expired. Please register again.");
        }

        if (pending.Code != request.Code)
            throw new UnauthorizedAccessException("Invalid verification code.");

        _pendingRegistrations.Remove(request.Email);

        await _userRepo.CreateAsync(new CreateUserRequest(
            pending.Request.Email,
            pending.Request.Password,
            pending.Request.FirstName,
            pending.Request.LastName,
            pending.Request.CategoryId,
            pending.Request.LevelId
        ), ct);
        
        var identityUser = await _userManager.FindByEmailAsync(request.Email)
                           ?? throw new InvalidOperationException("User not found after creation.");

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(identityUser);
        await _userManager.ConfirmEmailAsync(identityUser, token);
    }

    public async Task LogoutAsync(LogoutRequest request, CancellationToken ct = default)
    {
        var token = await _refreshTokenRepo.GetActiveByTokenAsync(request.RefreshToken, ct);
        if (token is null) return;

        token.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepo.SaveAsync(token, ct);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken ct = default)
    {
        var identityUser = await _userManager.FindByEmailAsync(request.Email);
        if (identityUser is null) return;

        var token = await _userManager.GeneratePasswordResetTokenAsync(identityUser);
        var resetLink = BuildPasswordResetLink(request.Email, EncodeResetToken(token));

        await _emailService.SendEmailAsync(new EmailMessage
        {
            To = request.Email,
            Subject = "Reset your Menterview password",
            Body = BuildPasswordResetEmail(resetLink),
            IsBodyHtml = false
        });
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken ct = default)
    {
        var identityUser = await _userManager.FindByEmailAsync(request.Email)
                           ?? throw new InvalidOperationException("Invalid reset request.");

        var result = await _userManager.ResetPasswordAsync(identityUser, DecodeResetToken(request.Token), request.NewPassword);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));
    }

    public async Task<AuthResponse> RefreshAsync(RefreshTokenRequest request, CancellationToken ct = default)
    {
        var refreshToken = await _refreshTokenRepo.GetActiveByTokenAsync(request.RefreshToken, ct)
                           ?? throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        var identityUser = await _userManager.FindByIdAsync(refreshToken.IdentityUserId)
                           ?? throw new UnauthorizedAccessException("User not found.");

        var user = await _userRepo.GetByIdAsync(Guid.Parse(refreshToken.IdentityUserId))
                   ?? throw new UnauthorizedAccessException("User not found.");

        refreshToken.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepo.SaveAsync(refreshToken, ct);

        return await IssueTokensAsync(user, ct);
    }

    private async Task<AuthResponse> IssueTokensAsync(User user, CancellationToken ct)
    {
        var identityUser = await _userManager.FindByIdAsync(user.UserId.ToString())!;
        var roles = await _userManager.GetRolesAsync(identityUser!);

        var accessToken = _jwtService.GenerateAccessToken(user.UserId, user.EmailAddress, roles);
        var refreshRaw = _jwtService.GenerateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays);

        await _refreshTokenRepo.SaveAsync(new RefreshToken
        {
            Token = refreshRaw,
            IdentityUserId = user.UserId.ToString(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        }, ct);

        return new AuthResponse
        {
            UserId = user.UserId,
            AccessToken = accessToken,
            RefreshToken = refreshRaw,
            ExpiresAt = expiresAt
        };
    }

    private static string GenerateVerificationCode()
    {
        return Random.Shared.Next(100000, 999999).ToString();
    }

    private static string BuildVerificationEmail(string firstName, string code)
    {
        return $"""
                <h2>Welcome to Menterview, {firstName}!</h2>
                <p>Your verification code is:</p>
                <h1 style="letter-spacing: 8px; font-size: 48px; color: #4F46E5;">{code}</h1>
                <p>This code expires in <strong>10 minutes</strong>.</p>
                """;
    }

    private string BuildPasswordResetLink(string email, string token)
    {
        var baseUrl = string.IsNullOrWhiteSpace(_frontendSettings.BaseUrl)
            ? "http://localhost:5173"
            : _frontendSettings.BaseUrl.TrimEnd('/');

        var encodedEmail = Uri.EscapeDataString(email);
        var encodedToken = Uri.EscapeDataString(token);

        return $"{baseUrl}/reset-password?email={encodedEmail}&token={encodedToken}";
    }

    private static string BuildPasswordResetEmail(string resetLink)
    {
        return $"""
                Reset your Menterview password

                Open this link to reset your password. It expires in 1 hour.

                {resetLink}

                If you did not request a password reset, you can ignore this email.
                """;
    }

    private static string EncodeResetToken(string token)
    {
        var bytes = Encoding.UTF8.GetBytes(token);
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private static string DecodeResetToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
            return token;

        try
        {
            var normalized = token
                .Replace('-', '+')
                .Replace('_', '/');

            normalized = (normalized.Length % 4) switch
            {
                2 => normalized + "==",
                3 => normalized + "=",
                _ => normalized
            };

            var bytes = Convert.FromBase64String(normalized);
            return Encoding.UTF8.GetString(bytes);
        }
        catch (FormatException)
        {
            return token;
        }
    }
    
    private static void ValidatePassword(string password)
    {
        var errors = new List<string>();

        if (password.Length < 8)
            errors.Add("Password must be at least 8 characters.");

        if (!password.Any(char.IsUpper))
            errors.Add("Password must contain at least one uppercase letter.");

        if (!password.Any(char.IsLower))
            errors.Add("Password must contain at least one lowercase letter.");

        if (!password.Any(char.IsDigit))
            errors.Add("Password must contain at least one digit.");
        
        if (errors.Any())
            throw new ArgumentException(string.Join(" ", errors));
    }
}