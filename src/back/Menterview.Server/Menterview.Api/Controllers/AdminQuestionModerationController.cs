using Menterview.Api.Models.Admin;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Question;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Admin;
using Menterview.Application.Dtos.Question;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/questions")]
[Authorize(Roles = "Administrator")]
public class AdminQuestionModerationController : ControllerBase
{
    private readonly IQuestionModerationService _moderationService;

    public AdminQuestionModerationController(IQuestionModerationService moderationService)
    {
        _moderationService = moderationService;
    }
    
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminQuestionListItemDto>>>> GetAllQuestions(
        [FromQuery] GetAdminQuestionsQuery query, CancellationToken ct)
    {
        var result = await _moderationService.GetAllQuestionsAsync(
            query.Page, query.PageSize, query.SearchTerm,
            query.CategoryId, query.DifficultyId, query.TagIds,
            query.IncludeDeleted, ct);

        return Ok(ApiResponse<PagedResult<AdminQuestionListItemDto>>.Success(new PagedResult<AdminQuestionListItemDto>
        {
            Items = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        }));
    }

    [HttpGet("pending")]
    public async Task<ActionResult<ApiResponse<PagedResult<PendingQuestionDto>>>> GetPendingQuestions(
        [FromQuery] GetPendingQuestionsQuery query, CancellationToken ct)
    {
        var result = await _moderationService.GetPendingQuestionsAsync(
            query.Page, query.PageSize, query.Type, ct);

        return Ok(ApiResponse<PagedResult<PendingQuestionDto>>.Success(new PagedResult<PendingQuestionDto>
        {
            Items = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        }));
    }

    [HttpGet("pending/{suggestionId:long}")]
    public async Task<ActionResult<ApiResponse<PendingQuestionDetailsDto>>> GetPendingSuggestion(
        long suggestionId, CancellationToken ct)
    {
        var result = await _moderationService.GetPendingSuggestionAsync(suggestionId, ct);
        return Ok(ApiResponse<PendingQuestionDetailsDto>.Success(result));
    }

    [HttpPost("pending/{suggestionId:long}/approve")]
    public async Task<ActionResult<ApiResponse>> ApproveSuggestion(long suggestionId, CancellationToken ct)
    {
        await _moderationService.ApproveSuggestionAsync(suggestionId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPost("pending/{suggestionId:long}/reject")]
    public async Task<ActionResult<ApiResponse>> RejectSuggestion(
        long suggestionId, [FromBody] RejectSuggestionRequest request, CancellationToken ct)
    {
        await _moderationService.RejectSuggestionAsync(suggestionId, request.RejectionReason, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpPut("pending/{suggestionId:long}/tags")]
    public async Task<ActionResult<ApiResponse>> UpdatePendingSuggestionTags(
        long suggestionId, [FromBody] UpdateSuggestionTagsRequest request, CancellationToken ct)
    {
        await _moderationService.UpdatePendingSuggestionTagsAsync(suggestionId, request.TagIds, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("{questionId:long}")]
    public async Task<ActionResult<ApiResponse>> DeleteQuestion(long questionId, CancellationToken ct)
    {
        await _moderationService.DeleteQuestionAsync(questionId, ct);
        return Ok(ApiResponse.Success());
    }
}
