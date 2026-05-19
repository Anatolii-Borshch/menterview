using Menterview.Application.Dtos.Stats;
using Menterview.Domain.Enums;

namespace Menterview.Application.Contracts.Service;

public interface IAdminStatsService
{
    Task<SystemStatsDto> GetSystemStatsAsync(CancellationToken ct = default);
    Task<UserStatsDto> GetUserStatsAsync(DateTime? from, DateTime? to, StatsGranularity granularity, CancellationToken ct = default);
    Task<QuestionStatsDto> GetQuestionStatsAsync(DateTime? from, DateTime? to, StatsGranularity granularity, CancellationToken ct = default);
    Task<GlobalSessionStatsDto> GetSessionStatsAsync(DateTime? from, DateTime? to, StatsGranularity granularity, CancellationToken ct = default);
}
