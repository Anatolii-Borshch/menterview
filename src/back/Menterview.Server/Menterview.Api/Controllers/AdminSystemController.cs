using Menterview.Api.Models.General;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/system")]
[Authorize(Roles = "Administrator")]
public class AdminSystemController : ControllerBase
{
    private readonly ISystemStatusService _systemStatusService;

    public AdminSystemController(ISystemStatusService systemStatusService)
    {
        _systemStatusService = systemStatusService;
    }

    [HttpGet("status")]
    public async Task<ActionResult<ApiResponse<SystemStatusDto>>> GetSystemStatus(CancellationToken ct)
    {
        var status = await _systemStatusService.GetSystemStatusAsync(ct);
        return Ok(ApiResponse<SystemStatusDto>.Success(status));
    }
}