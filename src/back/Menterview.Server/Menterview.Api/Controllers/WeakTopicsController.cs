using System.Security.Claims;
using Menterview.Api.Models.General;
using Menterview.Application.Contracts;
using Menterview.Application.Dtos.WeakPoint;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/weak-topics")]
[Authorize]
public class WeakTopicsController : ControllerBase
{
    private readonly IWeakTopicService _weakTopicService;

    public WeakTopicsController(IWeakTopicService weakTopicService)
    {
        _weakTopicService = weakTopicService;
    }

    private Guid GetUserId()
    {
        var raw = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value
                  ?? throw new UnauthorizedAccessException("User ID not found in token.");
        return Guid.Parse(raw);
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<WeakTopicDto>>>> GetWeakTopics(CancellationToken ct)
    {
        var result = await _weakTopicService.GetWeakTopicsAsync(GetUserId(), ct);
        return Ok(ApiResponse<IEnumerable<WeakTopicDto>>.Success(result));
    }

    [HttpGet("due")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WeakTopicDto>>>> GetDueWeakTopics(CancellationToken ct)
    {
        var result = await _weakTopicService.GetDueWeakTopicsAsync(GetUserId(), ct);
        return Ok(ApiResponse<IEnumerable<WeakTopicDto>>.Success(result));
    }

    [HttpDelete("{weakTopicId:long}")]
    public async Task<ActionResult<ApiResponse>> DismissWeakTopic(long weakTopicId, CancellationToken ct)
    {
        await _weakTopicService.DismissWeakTopicAsync(GetUserId(), weakTopicId, ct);
        return Ok(ApiResponse.Success());
    }
}
