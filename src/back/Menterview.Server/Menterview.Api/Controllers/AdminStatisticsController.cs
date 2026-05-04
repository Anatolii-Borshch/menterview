using Menterview.Api.Models.General;
using Menterview.Api.Models.Stats;
using Menterview.Application.Dtos.Stats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/stats")]
[Authorize(Roles = "Admin")]
public class AdminStatisticsController : ControllerBase
{
    public AdminStatisticsController() { }

    // GET api/admin/stats
    // Global system overview
    [HttpGet]
    public async Task<ActionResult<ApiResponse<SystemStatsDto>>> GetSystemStats()
    {
        throw new NotImplementedException();
    }

    // GET api/admin/stats/users
    // User growth and activity trends
    [HttpGet("users")]
    public async Task<ActionResult<ApiResponse<UserStatsDto>>> GetUserStats(
        [FromQuery] StatsRangeQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/admin/stats/questions
    // Question usage and moderation stats
    [HttpGet("questions")]
    public async Task<ActionResult<ApiResponse<QuestionStatsDto>>> GetQuestionStats(
        [FromQuery] StatsRangeQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/admin/stats/sessions
    // Session activity and accuracy trends across all users
    [HttpGet("sessions")]
    public async Task<ActionResult<ApiResponse<GlobalSessionStatsDto>>> GetSessionStats(
        [FromQuery] StatsRangeQuery query)
    {
        throw new NotImplementedException();
    }
}