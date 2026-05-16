using Menterview.Api.Models.Category;
using Menterview.Api.Models.Difficulty;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Tag;
using Menterview.Application.Contracts;
using Menterview.Application.Dtos.Sub;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/reference")]
[Authorize(Roles = "Administrator")]
public class AdminReferenceController : ControllerBase
{
    private readonly IAdminReferenceService _referenceService;

    public AdminReferenceController(IAdminReferenceService referenceService)
    {
        _referenceService = referenceService;
    }

    // ── Categories ───────────────────────────────────────────────────────────

    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory(
        CreateCategoryRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateCategoryAsync(request.CategoryName, ct);
        return Ok(ApiResponse<CategoryDto>.Success(result));
    }

    [HttpPut("categories/{categoryId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateCategory(
        int categoryId, UpdateCategoryRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateCategoryAsync(categoryId, request.CategoryName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("categories/{categoryId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteCategory(int categoryId, CancellationToken ct)
    {
        await _referenceService.DeleteCategoryAsync(categoryId, ct);
        return Ok(ApiResponse.Success());
    }

    // ── Tags ─────────────────────────────────────────────────────────────────

    [HttpPost("tags")]
    public async Task<ActionResult<ApiResponse<TagDto>>> CreateTag(
        CreateTagRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateTagAsync(request.TagName, ct);
        return Ok(ApiResponse<TagDto>.Success(result));
    }

    [HttpPut("tags/{tagId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateTag(
        int tagId, UpdateTagRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateTagAsync(tagId, request.TagName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("tags/{tagId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteTag(int tagId, CancellationToken ct)
    {
        await _referenceService.DeleteTagAsync(tagId, ct);
        return Ok(ApiResponse.Success());
    }

    // ── Difficulties ──────────────────────────────────────────────────────────

    [HttpPost("difficulties")]
    public async Task<ActionResult<ApiResponse<DifficultyDto>>> CreateDifficulty(
        CreateDifficultyRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateDifficultyAsync(request.DifficultyName, ct);
        return Ok(ApiResponse<DifficultyDto>.Success(result));
    }

    [HttpPut("difficulties/{difficultyId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateDifficulty(
        int difficultyId, UpdateDifficultyRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateDifficultyAsync(difficultyId, request.DifficultyName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("difficulties/{difficultyId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteDifficulty(int difficultyId, CancellationToken ct)
    {
        await _referenceService.DeleteDifficultyAsync(difficultyId, ct);
        return Ok(ApiResponse.Success());
    }
}