using Menterview.Api.Models.Category;
using Menterview.Api.Models.Country;
using Menterview.Api.Models.Difficulty;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Language;
using Menterview.Api.Models.Level;
using Menterview.Api.Models.Role;
using Menterview.Api.Models.Tag;
using Menterview.Api.Models.Theme;
using Menterview.Application.Contracts.Service;
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

    [HttpPost("levels")]
    public async Task<ActionResult<ApiResponse<LevelDto>>> CreateLevel(
        CreateLevelRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateLevelAsync(request.LevelName, ct);
        return Ok(ApiResponse<LevelDto>.Success(result));
    }

    [HttpPut("levels/{levelId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateLevel(
        int levelId, UpdateLevelRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateLevelAsync(levelId, request.LevelName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("levels/{levelId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteLevel(int levelId, CancellationToken ct)
    {
        await _referenceService.DeleteLevelAsync(levelId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("countries")]
    public async Task<ActionResult<ApiResponse<CountryDto>>> CreateCountry(
        CreateCountryRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateCountryAsync(request.CountryName, ct);
        return Ok(ApiResponse<CountryDto>.Success(result));
    }

    [HttpPut("countries/{countryId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateCountry(
        int countryId, UpdateCountryRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateCountryAsync(countryId, request.CountryName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("countries/{countryId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteCountry(int countryId, CancellationToken ct)
    {
        await _referenceService.DeleteCountryAsync(countryId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("languages")]
    public async Task<ActionResult<ApiResponse<LanguageDto>>> CreateLanguage(
        CreateLanguageRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateLanguageAsync(request.LanguageName, ct);
        return Ok(ApiResponse<LanguageDto>.Success(result));
    }

    [HttpPut("languages/{languageId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateLanguage(
        int languageId, UpdateLanguageRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateLanguageAsync(languageId, request.LanguageName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("languages/{languageId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteLanguage(int languageId, CancellationToken ct)
    {
        await _referenceService.DeleteLanguageAsync(languageId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("roles")]
    public async Task<ActionResult<ApiResponse<RoleDto>>> CreateRole(
        CreateRoleRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateRoleAsync(request.RoleName, ct);
        return Ok(ApiResponse<RoleDto>.Success(result));
    }

    [HttpPut("roles/{roleId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateRole(
        int roleId, UpdateRoleRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateRoleAsync(roleId, request.RoleName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("roles/{roleId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteRole(int roleId, CancellationToken ct)
    {
        await _referenceService.DeleteRoleAsync(roleId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("themes")]
    public async Task<ActionResult<ApiResponse<ThemeDto>>> CreateTheme(
        CreateThemeRequest request, CancellationToken ct)
    {
        var result = await _referenceService.CreateThemeAsync(request.ThemeName, ct);
        return Ok(ApiResponse<ThemeDto>.Success(result));
    }

    [HttpPut("themes/{themeId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateTheme(
        int themeId, UpdateThemeRequest request, CancellationToken ct)
    {
        await _referenceService.UpdateThemeAsync(themeId, request.ThemeName, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("themes/{themeId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteTheme(int themeId, CancellationToken ct)
    {
        await _referenceService.DeleteThemeAsync(themeId, ct);
        return Ok(ApiResponse.Success());
    }
}