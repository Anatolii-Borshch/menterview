using System.Security.Claims;
using Menterview.Api.Models.General;
using Menterview.Api.Models.Sessions;
using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Session;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/sessions")]
[Authorize]
public class SessionController : ControllerBase
{
    private readonly ISessionService _sessionService;
    private ISessionOrchestrationService? _orchestrationService;

    public SessionController(ISessionService sessionService, ISessionOrchestrationService? orchestrationService = null)
    {
        _sessionService = sessionService;
        _orchestrationService = orchestrationService;
    }

    private Guid GetUserId()
    {
        var raw = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                  ?? User.FindFirst("sub")?.Value
                  ?? throw new UnauthorizedAccessException("User ID not found in token.");
        return Guid.Parse(raw);
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<SessionListItemDto>>>> GetSessionHistory(
        [FromQuery] GetSessionsQuery query, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _sessionService.GetHistoryAsync(userId, query.Page, query.PageSize, query.From, query.To, ct);

        var paged = new PagedResult<SessionListItemDto>
        {
            Items = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };

        return Ok(ApiResponse<PagedResult<SessionListItemDto>>.Success(paged));
    }

    [HttpGet("{sessionId:long}")]
    public async Task<ActionResult<ApiResponse<SessionDetailsDto>>> GetSessionDetails(
        long sessionId, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _sessionService.GetDetailsAsync(userId, sessionId, ct);
        return Ok(ApiResponse<SessionDetailsDto>.Success(result));
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<UserSessionStatsDto>>> GetSessionStats(
        [FromQuery] GetSessionStatsQuery query, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _sessionService.GetStatsAsync(userId, query.From, query.To, query.LastN, ct);
        return Ok(ApiResponse<UserSessionStatsDto>.Success(result));
    }

    [HttpGet("{sessionId:long}/export")]
    public IActionResult ExportSessionPdf(long sessionId)
    {
        return StatusCode(501, "PDF export not yet implemented.");
    }

    [HttpPost("start")]
    public async Task<ActionResult<ApiResponse<SessionStartedDto>>> StartSession(
        StartSessionRequest request, CancellationToken ct)
    {
        if (_orchestrationService is null)
            return StatusCode(503, ApiResponse.Failure("Session orchestration service is not available."));

        var userId = GetUserId();
        var command = new StartSessionCommand
        {
            CategoryId = request.CategoryId,
            DifficultyId = request.DifficultyId,
            TagIds = request.TagIds,
            QuestionsAmount = request.QuestionsAmount,
            WeakTopicRatio = request.WeakTopicRatio
        };
        var result = await _orchestrationService.StartSessionAsync(userId, command, ct);
        return Ok(ApiResponse<SessionStartedDto>.Success(result));
    }

    [HttpPost("finish")]
    [Authorize(Policy = "AiWorkerOnly")]
    public async Task<ActionResult<ApiResponse>> FinishSession(
        FinishSessionRequest request, CancellationToken ct)
    {
        if (_orchestrationService is null)
            return StatusCode(503, ApiResponse.Failure("Session orchestration service is not available."));

        var command = new FinishSessionCommand
        {
            SessionId = request.SessionId,
            TotalTime = request.TotalTime,
            Answers = request.Answers,
            AiGeneratedQuestions = request.AiGeneratedQuestions.Select(q => new AiGeneratedQuestionCommand
            {
                QuestionText = q.QuestionText,
                Answer = q.Answer,
                CategoryId = q.CategoryId,
                DifficultyId = q.DifficultyId,
                TagIds = q.TagIds
            })
        };
        await _orchestrationService.FinishSessionAsync(command, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpGet("{sessionId:long}/answers")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AnswerBreakdownDto>>>> GetAnswerAnalysis(
        long sessionId, CancellationToken ct)
    {
        var userId = GetUserId();
        var result = await _sessionService.GetAnswerBreakdownAsync(userId, sessionId, ct);
        return Ok(ApiResponse<IEnumerable<AnswerBreakdownDto>>.Success(result));
    }
}