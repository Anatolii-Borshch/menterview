using System.Security.Claims;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Question;
using Menterview.Application.Contracts.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/questions")]
[Authorize]
public class QuestionSuggestionsController : ControllerBase
{
    private readonly IQuestionModerationService _moderationService;

    public QuestionSuggestionsController(IQuestionModerationService moderationService)
    {
        _moderationService = moderationService;
    }

    [HttpPost("suggest")]
    public async Task<ActionResult<ApiResponse<long>>> SuggestQuestion(
        [FromBody] CreateQuestionSuggestionRequest request, CancellationToken ct)
    {
        if (request.TagIds is null || !request.TagIds.Any())
            return BadRequest(ApiResponse<long>.Failure("At least one tag is required."));

        var userId = Guid.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value
            ?? throw new UnauthorizedAccessException("User ID not found."));

        var suggestionId = await _moderationService.SuggestQuestionAsync(
            userId, request.QuestionText, request.Answer,
            request.CategoryId, request.DifficultyId, request.TagIds, ct);

        return Ok(ApiResponse<long>.Success(suggestionId));
    }
}
