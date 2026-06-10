using Menterview.Application.Dtos.Admin;

namespace Menterview.Application.Contracts.Service;

public interface ISystemStatusService
{
    Task<SystemStatusDto> GetSystemStatusAsync(CancellationToken ct = default);
}
