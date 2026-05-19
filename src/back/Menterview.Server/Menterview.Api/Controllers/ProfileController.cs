using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Menterview.Api.Models.General;
using Menterview.Api.Models.User;
using Menterview.Application.Contracts.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserProfileDto = Menterview.Application.Dtos.Profile.UserProfileDto;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetProfile(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        var profile = await _profileService.GetProfileAsync(userId, ct);
        return Ok(ApiResponse<UserProfileDto>.Success(profile));
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse>> UpdateProfile(
        [FromBody] UpdateProfileRequest request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _profileService.UpdateProfileAsync(userId, request.FirstName, request.LastName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse>> DeleteAccount(CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _profileService.DeleteAccountAsync(userId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPut("category")]
    public async Task<ActionResult<ApiResponse>> UpdateCategory(
        [FromBody] UpdateUserCategoryRequest request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _profileService.UpdateCategoryAsync(userId, request.CategoryId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPut("difficulty")]
    public async Task<ActionResult<ApiResponse>> UpdateDifficulty(
        [FromBody] UpdateUserDifficultyRequest request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _profileService.UpdateDifficultyAsync(userId, request.DifficultyId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPut("level")]
    public async Task<ActionResult<ApiResponse>> UpdateLevel(
        [FromBody] UpdateUserLevelRequest request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _profileService.UpdateLevelAsync(userId, request.LevelId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPut("skills")]
    public async Task<ActionResult<ApiResponse>> UpdateSkills(
        [FromBody] UpdateUserSkillsRequest request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserId();
        await _profileService.UpdateSkillTagsAsync(userId, request.TagIds, ct);
        return Ok(ApiResponse.Success());
    }

    private Guid GetCurrentUserId()
    {
        var raw = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                  ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(raw) || !Guid.TryParse(raw, out var userId))
            throw new UnauthorizedAccessException("User identifier missing or invalid in token.");

        return userId;
    }
}