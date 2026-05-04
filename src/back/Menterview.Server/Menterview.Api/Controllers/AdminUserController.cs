using Menterview.Api.Models.General;
using Menterview.Api.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUserController : ControllerBase
{
    public AdminUserController() { }

    // GET api/admin/users
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AdminUserListItemDto>>>> GetAllUsers(
        [FromQuery] GetUsersQuery query)
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
}