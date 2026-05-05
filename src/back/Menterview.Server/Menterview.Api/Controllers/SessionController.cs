using Menterview.Api.Models.General;
using Menterview.Api.Models.Sessions;
using Menterview.Application.Dtos.Session;
using Menterview.Application.Dtos.Stats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/sessions")]
[Authorize]
public class SessionController : ControllerBase
{
    public SessionController() { }

    // GET api/sessions
    // Paginated session history for the authenticated user
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<SessionListItemDto>>>> GetSessionHistory(
        [FromQuery] GetSessionsQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/sessions/{sessionId:long}
    // Full session details with answer breakdown
    [HttpGet("{sessionId:long}")]
    public async Task<ActionResult<ApiResponse<SessionDetailsDto>>> GetSessionDetails(
        long sessionId)
    {
        throw new NotImplementedException();
    }

    // GET api/sessions/stats
    // Trend data across all sessions — accuracy, time, progress
    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<UserSessionStatsDto>>> GetSessionStats(
        [FromQuery] GetSessionStatsQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/sessions/{sessionId:long}/export
    // Export single session as PDF
    [HttpGet("{sessionId:long}/export")]
    public async Task<IActionResult> ExportSessionPdf(long sessionId)
    {
        // Returns raw PDF file, not wrapped in ApiResponse
        // Content-Type: application/pdf
        throw new NotImplementedException();
    }
    // POST api/sessions/start
    // API builds question list, spawns AI worker container,
    // returns session token + worker connection info to client
    [HttpPost("start")]
    public async Task<ActionResult<ApiResponse<SessionStartedDto>>> StartSession(
        StartSessionRequest request)
    {
        throw new NotImplementedException();
    }

    // POST api/sessions/finish
    // Called by AI worker (not client) when session ends
    // Validates worker JWT, persists results, triggers gap analysis
    [HttpPost("finish")]
    [Authorize(Policy = "AiWorkerOnly")]
    public async Task<ActionResult<ApiResponse>> FinishSession(
        FinishSessionRequest request)
    {
        throw new NotImplementedException();
    }

    // GET api/sessions/{sessionId:long}/answers
    // Detailed per-answer analysis for a single session
    // Covers: "Viewing detailed answer analysis"
    [HttpGet("{sessionId:long}/answers")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AnswerBreakdownDto>>>> GetAnswerAnalysis(
        long sessionId)
    {
        throw new NotImplementedException();
    }
}