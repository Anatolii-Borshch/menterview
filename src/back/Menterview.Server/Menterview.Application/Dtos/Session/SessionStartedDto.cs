namespace Menterview.Application.Dtos.Session;

public class SessionStartedDto
{
    public long SessionId { get; set; }
    public string WorkerEndpoint { get; set; } = null!;
    public string WorkerToken { get; set; } = null!;
    public IEnumerable<SessionQuestionDto> Questions { get; set; } = [];
    public int WeakTopicCount { get; set; }
}