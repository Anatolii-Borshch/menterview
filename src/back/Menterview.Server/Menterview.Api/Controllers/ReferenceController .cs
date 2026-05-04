using Menterview.Api.Models;
using Menterview.Api.Models.General;
using Menterview.Application.Dtos.Sub;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/reference")]
[Authorize]
public class ReferenceController : ControllerBase
{
    public ReferenceController() { }

    // GET api/reference/categories
    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CategoryDto>>>> GetCategories()
    {
        throw new NotImplementedException();
    }

    // GET api/reference/difficulties
    [HttpGet("difficulties")]
    public async Task<ActionResult<ApiResponse<IEnumerable<DifficultyDto>>>> GetDifficulties()
    {
        throw new NotImplementedException();
    }

    // GET api/reference/tags
    [HttpGet("tags")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TagDto>>>> GetTags()
    {
        throw new NotImplementedException();
    }
}