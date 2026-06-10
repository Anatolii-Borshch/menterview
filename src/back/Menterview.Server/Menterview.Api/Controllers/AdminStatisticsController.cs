using Menterview.Api.Models.General;
using Menterview.Api.Models.Stats;
using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Stats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/stats")]
[Authorize(Roles = "Administrator")]
public class AdminStatisticsController : ControllerBase
{
    private readonly IAdminStatsService _statsService;

    public AdminStatisticsController(IAdminStatsService statsService)
    {
        _statsService = statsService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<SystemStatsDto>>> GetSystemStats(CancellationToken ct)
    {
        var result = await _statsService.GetSystemStatsAsync(ct);
        return Ok(ApiResponse<SystemStatsDto>.Success(result));
    }

    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<UserStatsDto>>> GetUserStats(
        [FromQuery] StatsRangeQuery query, CancellationToken ct)
    {
        var result = await _statsService.GetUserStatsAsync(query.From, query.To, query.Granularity, ct);
        return Ok(ApiResponse<UserStatsDto>.Success(result));
    }

    [HttpGet("questions")]
    public async Task<ActionResult<ApiResponse<QuestionStatsDto>>> GetQuestionStats(
        [FromQuery] StatsRangeQuery query, CancellationToken ct)
    {
        var result = await _statsService.GetQuestionStatsAsync(query.From, query.To, query.Granularity, ct);
        return Ok(ApiResponse<QuestionStatsDto>.Success(result));
    }

    [HttpGet("sessions")]
    public async Task<ActionResult<ApiResponse<GlobalSessionStatsDto>>> GetSessionStats(
        [FromQuery] StatsRangeQuery query, CancellationToken ct)
    {
        var result = await _statsService.GetSessionStatsAsync(query.From, query.To, query.Granularity, ct);
        return Ok(ApiResponse<GlobalSessionStatsDto>.Success(result));
    }
}