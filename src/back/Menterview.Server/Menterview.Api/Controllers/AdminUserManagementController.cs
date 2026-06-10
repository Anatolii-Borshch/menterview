using Menterview.Api.Models.General;
using Menterview.Api.Models.User;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Administrator")]
public class AdminUserManagementController : ControllerBase
{
    private readonly IAdminUserService _adminUserService;

    public AdminUserManagementController(IAdminUserService adminUserService)
    {
        _adminUserService = adminUserService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminUserListItemDto>>>> GetUsers(
        [FromQuery] GetUsersQuery query, CancellationToken ct)
    {
        var result = await _adminUserService.GetUsersAsync(
            query.Page, query.PageSize, query.SearchTerm, query.RoleId, ct);

        var response = new PagedResult<AdminUserListItemDto>
        {
            Items = result.Items,
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };

        return Ok(ApiResponse<PagedResult<AdminUserListItemDto>>.Success(response));
    }

    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<ApiResponse<AdminUserDetailsDto>>> GetUserDetails(
        Guid userId, CancellationToken ct)
    {
        var result = await _adminUserService.GetUserDetailsAsync(userId, ct);
        return Ok(ApiResponse<AdminUserDetailsDto>.Success(result));
    }

    [HttpPut("{userId:guid}/role")]
    public async Task<ActionResult<ApiResponse>> AssignRole(
        Guid userId, [FromBody] AssignRoleRequest request, CancellationToken ct)
    {
        await _adminUserService.AssignRoleAsync(userId, request.RoleId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("{userId:guid}")]
    public async Task<ActionResult<ApiResponse>> SoftDeleteUser(Guid userId, CancellationToken ct)
    {
        await _adminUserService.SoftDeleteUserAsync(userId, ct);
        return Ok(ApiResponse.Success());
    }

    [HttpDelete("{userId:guid}/permanent")]
    public async Task<ActionResult<ApiResponse>> HardDeleteUser(Guid userId, CancellationToken ct)
    {
        await _adminUserService.HardDeleteUserAsync(userId, ct);
        return Ok(ApiResponse.Success());
    }
}
