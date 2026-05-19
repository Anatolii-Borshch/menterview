using Menterview.Api.Models.General;
using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Sub;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/reference")]
public class ReferenceController : ControllerBase
{
    private readonly IReferenceService _referenceService;

    public ReferenceController(IReferenceService referenceService)
    {
        _referenceService = referenceService;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CategoryDto>>>> GetCategories(CancellationToken ct)
    {
        var result = await _referenceService.GetCategoriesAsync(ct);
        return Ok(ApiResponse<IEnumerable<CategoryDto>>.Success(result));
    }

    [HttpGet("difficulties")]
    public async Task<ActionResult<ApiResponse<IEnumerable<DifficultyDto>>>> GetDifficulties(CancellationToken ct)
    {
        var result = await _referenceService.GetDifficultiesAsync(ct);
        return Ok(ApiResponse<IEnumerable<DifficultyDto>>.Success(result));
    }

    [HttpGet("tags")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TagDto>>>> GetTags(CancellationToken ct)
    {
        var result = await _referenceService.GetTagsAsync(ct);
        return Ok(ApiResponse<IEnumerable<TagDto>>.Success(result));
    }

    [HttpGet("levels")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LevelDto>>>> GetLevels(CancellationToken ct)
    {
        var result = await _referenceService.GetLevelsAsync(ct);
        return Ok(ApiResponse<IEnumerable<LevelDto>>.Success(result));
    }
}
