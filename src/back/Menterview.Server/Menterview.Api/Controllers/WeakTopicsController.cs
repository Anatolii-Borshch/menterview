using Menterview.Api.Models.General;
using Menterview.Application.Dtos.WeakPoint;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/weak-topics")]
[Authorize]
public class WeakTopicsController : ControllerBase
{
    public WeakTopicsController() { }

    // GET api/weak-topics
    // Returns all weak topics for authenticated user
    // Covers: "Reviewing weak topics"
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<WeakTopicDto>>>> GetWeakTopics()
    {
        throw new NotImplementedException();
    }

    // GET api/weak-topics/due
    // Returns only topics due for review today (NextReviewAt <= now)
    // Used by session builder to show user what will be included
    [HttpGet("due")]
    public async Task<ActionResult<ApiResponse<IEnumerable<WeakTopicDto>>>> GetDueWeakTopics()
    {
        throw new NotImplementedException();
    }

    // DELETE api/weak-topics/{weakTopicId:long}
    // User manually dismisses a weak topic
    [HttpDelete("{weakTopicId:long}")]
    public async Task<ActionResult<ApiResponse>> DismissWeakTopic(long weakTopicId)
    {
        throw new NotImplementedException();
    }
}
