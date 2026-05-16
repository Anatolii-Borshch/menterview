using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Session;

namespace Menterview.Application.Contracts;

public interface ISessionService
{
    Task<PagedResult<SessionListItemDto>> GetHistoryAsync(
        Guid userId, int page, int pageSize, DateTime? from, DateTime? to, CancellationToken ct = default);

    Task<SessionDetailsDto> GetDetailsAsync(Guid userId, long sessionId, CancellationToken ct = default);

    Task<IEnumerable<AnswerBreakdownDto>> GetAnswerBreakdownAsync(Guid userId, long sessionId, CancellationToken ct = default);

    Task<UserSessionStatsDto> GetStatsAsync(Guid userId, DateTime? from, DateTime? to, int? lastN, CancellationToken ct = default);
}
