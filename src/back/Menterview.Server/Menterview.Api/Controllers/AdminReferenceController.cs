using Menterview.Api.Models.Category;
using Menterview.Api.Models.Difficulty;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Tag;
using Menterview.Application.Dtos.Sub;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/reference")]
[Authorize(Roles = "Admin")]
public class AdminReferenceController : ControllerBase
{
    public AdminReferenceController() { }

    // POST api/admin/reference/categories
    [HttpPost("categories")]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> CreateCategory(
        CreateCategoryRequest request)
    {
        throw new NotImplementedException();
    }

    // PUT api/admin/reference/categories/{categoryId:int}
    [HttpPut("categories/{categoryId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateCategory(
        int categoryId,
        UpdateCategoryRequest request)
    {
        throw new NotImplementedException();
    }

    // DELETE api/admin/reference/categories/{categoryId:int}
    [HttpDelete("categories/{categoryId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteCategory(int categoryId)
    {
        throw new NotImplementedException();
    }

    // POST api/admin/reference/tags
    [HttpPost("tags")]
    public async Task<ActionResult<ApiResponse<TagDto>>> CreateTag(
        CreateTagRequest request)
    {
        throw new NotImplementedException();
    }

    // PUT api/admin/reference/tags/{tagId:int}
    [HttpPut("tags/{tagId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateTag(
        int tagId,
        UpdateTagRequest request)
    {
        throw new NotImplementedException();
    }

    // DELETE api/admin/reference/tags/{tagId:int}
    [HttpDelete("tags/{tagId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteTag(int tagId)
    {
        throw new NotImplementedException();
    }

    // --- DIFFICULTIES ---

    // POST api/admin/reference/difficulties
    [HttpPost("difficulties")]
    public async Task<ActionResult<ApiResponse<DifficultyDto>>> CreateDifficulty(
        CreateDifficultyRequest request)
    {
        throw new NotImplementedException();
    }

    // PUT api/admin/reference/difficulties/{difficultyId:int}
    [HttpPut("difficulties/{difficultyId:int}")]
    public async Task<ActionResult<ApiResponse>> UpdateDifficulty(
        int difficultyId,
        UpdateDifficultyRequest request)
    {
        throw new NotImplementedException();
    }

    // DELETE api/admin/reference/difficulties/{difficultyId:int}
    [HttpDelete("difficulties/{difficultyId:int}")]
    public async Task<ActionResult<ApiResponse>> DeleteDifficulty(int difficultyId)
    {
        throw new NotImplementedException();
    }
}