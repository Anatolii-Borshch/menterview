using Menterview.Api.Models.Admin;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Question;
using Menterview.Application.Dtos.Admin;
using Menterview.Application.Dtos.Question;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/questions")]
[Authorize(Roles = "Admin")]
public class AdminQuestionModerationController : ControllerBase
{
    public AdminQuestionModerationController() { }

    // GET api/admin/questions
    // All questions including soft deleted, with full filters
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminQuestionListItemDto>>>> GetAllQuestions(
        [FromQuery] GetAdminQuestionsQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/admin/questions/pending
    [HttpGet("pending")]
    public async Task<ActionResult<ApiResponse<PagedResult<PendingQuestionDto>>>> GetPendingQuestions(
        [FromQuery] GetPendingQuestionsQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/admin/questions/pending/{suggestionId:long}
    [HttpGet("pending/{suggestionId:long}")]
    public async Task<ActionResult<ApiResponse<PendingQuestionDetailsDto>>> GetPendingSuggestion(
        long suggestionId)
    {
        throw new NotImplementedException();
    }

    // POST api/admin/questions/pending/{suggestionId:long}/approve
    [HttpPost("pending/{suggestionId:long}/approve")]
    public async Task<ActionResult<ApiResponse>> ApproveSuggestion(long suggestionId)
    {
        throw new NotImplementedException();
    }

    // POST api/admin/questions/pending/{suggestionId:long}/reject
    [HttpPost("pending/{suggestionId:long}/reject")]
    public async Task<ActionResult<ApiResponse>> RejectSuggestion(
        long suggestionId,
        RejectSuggestionRequest request)
    {
        throw new NotImplementedException();
    }

    // DELETE api/admin/questions/{questionId:long}
    // Admin hard delete — bypasses soft delete stage
    [HttpDelete("{questionId:long}")]
    public async Task<ActionResult<ApiResponse>> DeleteQuestion(long questionId)
    {
        throw new NotImplementedException();
    }
}
