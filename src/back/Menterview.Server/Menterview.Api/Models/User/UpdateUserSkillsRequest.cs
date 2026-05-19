namespace Menterview.Api.Models.User;

public class UpdateUserSkillsRequest
{
    public IReadOnlyList<int> TagIds { get; set; } = [];
}