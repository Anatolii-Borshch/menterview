using Menterview.Api.Models.General;
using Menterview.Application.Contracts.Auth;
using Menterview.Application.Dtos.Auth;
using Menterview.Application.Models.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IGoogleAuthService _googleAuthService;

    public AuthController(IAuthService authService, IGoogleAuthService googleAuthService)
    {
        _authService = authService;
        _googleAuthService = googleAuthService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse>> RegisterAsync(
        [FromBody] RegisterRequest request, CancellationToken ct)
    {
        await _authService.RegisterAsync(request, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("register/verify")]
    public async Task<ActionResult<ApiResponse>> VerifyEmailAsync(
        [FromBody] VerifyEmailRequest request, CancellationToken ct)
    {
        await _authService.VerifyEmailAsync(request, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> LoginAsync(
        [FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);
        return Ok(ApiResponse<AuthResponse>.Success(result));
    }

    [HttpPost("login/google")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> GoogleLoginAsync(
        [FromBody] GoogleAuthRequest request, CancellationToken ct)
    {
        var googleUser = await _googleAuthService.ValidateIdTokenAsync(request.IdToken, ct);
        if (googleUser is null)
            return Unauthorized(ApiResponse<AuthResponse>.Failure("Invalid Google ID token."));

        var result = await _authService.GoogleLoginAsync(googleUser, ct: ct);
        return Ok(ApiResponse<AuthResponse>.Success(result));
    }

    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse>> LogoutAsync(
        [FromBody] LogoutRequest request, CancellationToken ct)
    {
        await _authService.LogoutAsync(request, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> RefreshAsync(
        [FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        var result = await _authService.RefreshAsync(request, ct);
        return Ok(ApiResponse<AuthResponse>.Success(result));
    }

    [HttpPost("password/forgot")]
    public async Task<ActionResult<ApiResponse>> ForgotPasswordAsync(
        [FromBody] ForgotPasswordRequest request, CancellationToken ct)
    {
        await _authService.ForgotPasswordAsync(request, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("password/reset")]
    public async Task<ActionResult<ApiResponse>> ResetPasswordAsync(
        [FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        await _authService.ResetPasswordAsync(request, ct);
        return Ok(ApiResponse.Success());
    }
}