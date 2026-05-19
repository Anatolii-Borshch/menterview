using Menterview.Application.Dtos.Session;

namespace Menterview.Application.Contracts.Service;

public interface ISessionOrchestrationService
{
    Task<SessionStartedDto> StartSessionAsync(Guid userId, StartSessionCommand command, CancellationToken ct = default);
    Task FinishSessionAsync(FinishSessionCommand command, CancellationToken ct = default);
}
