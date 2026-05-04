using Menterview.Api.Models.General;
using Menterview.Api.Models.User;
using Menterview.Application.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUserManagementController : ControllerBase
{
    public AdminUserManagementController() { }

    // GET api/admin/users
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminUserListItemDto>>>> GetUsers(
        [FromQuery] GetUsersQuery query)
    {
        throw new NotImplementedException();
    }

    // GET api/admin/users/{userId:guid}
    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<ApiResponse<AdminUserDetailsDto>>> GetUserDetails(
        Guid userId)
    {
        throw new NotImplementedException();
    }

    // PUT api/admin/users/{userId:guid}/role
    [HttpPut("{userId:guid}/role")]
    public async Task<ActionResult<ApiResponse>> AssignRole(
        Guid userId,
        AssignRoleRequest request)
    {
        throw new NotImplementedException();
    }

    // DELETE api/admin/users/{userId:guid}
    // Soft delete user account
    [HttpDelete("{userId:guid}")]
    public async Task<ActionResult<ApiResponse>> SoftDeleteUser(Guid userId)
    {
        throw new NotImplementedException();
    }

    // DELETE api/admin/users/{userId:guid}/permanent
    // Hard delete — only if already soft deleted
    [HttpDelete("{userId:guid}/permanent")]
    public async Task<ActionResult<ApiResponse>> HardDeleteUser(Guid userId)
    {
        throw new NotImplementedException();
    }
}