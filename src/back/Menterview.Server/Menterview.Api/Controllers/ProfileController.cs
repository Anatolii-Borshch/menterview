using Menterview.Api.Models;
using Menterview.Api.Models.General;
using Menterview.Api.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    public ProfileController() { }

    // GET api/profile
    [HttpGet]
    public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetProfile()
    {
        throw new NotImplementedException();
    }

    // PUT api/profile
    [HttpPut]
    public async Task<ActionResult<ApiResponse>> UpdateProfile(
        UpdateProfileRequest request)
    {
        throw new NotImplementedException();
    }

    // DELETE api/profile
    [HttpDelete]
    public async Task<ActionResult<ApiResponse>> DeleteAccount()
    {
        throw new NotImplementedException();
    }

    // PUT api/profile/category
    [HttpPut("category")]
    public async Task<ActionResult<ApiResponse>> UpdateCategory(
        UpdateUserCategoryRequest request)
    {
        throw new NotImplementedException();
    }

    // PUT api/profile/difficulty
    [HttpPut("difficulty")]
    public async Task<ActionResult<ApiResponse>> UpdateDifficulty(
        UpdateUserDifficultyRequest request)
    {
        throw new NotImplementedException();
    }
}