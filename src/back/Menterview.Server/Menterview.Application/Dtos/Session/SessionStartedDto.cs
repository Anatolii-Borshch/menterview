namespace Menterview.Application.Dtos.Session;

public class SessionStartedDto
{
    public long SessionId { get; set; }
    public string SessionToken { get; set; } = null!;
    public string WorkerGrpcHost { get; set; } = null!;
    public string WorkerWsHost { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}