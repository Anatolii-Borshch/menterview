using Menterview.Application.Dtos.Session;

namespace Menterview.Application.Contracts.Client;

public interface IWorkerManagerClient
{
    Task<SpawnWorkerResult> SpawnWorkerAsync(SpawnWorkerCommand command, CancellationToken ct = default);
}

public class SpawnWorkerCommand
{
    public long SessionId { get; set; }
    public string SessionToken { get; set; } = null!;
    public string CallbackAddress { get; set; } = null!;
    public IEnumerable<SessionQuestionDto> Questions { get; set; } = [];
    public int TimeoutSeconds { get; set; } = 3600;
}

public class SpawnWorkerResult
{
    public bool Success { get; set; }
    public string WorkerGrpcHost { get; set; } = string.Empty;
    public string WorkerWsHost { get; set; } = string.Empty;
    public string ContainerId { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }
}
