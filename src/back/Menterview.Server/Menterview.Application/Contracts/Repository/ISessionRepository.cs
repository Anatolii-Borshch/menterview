using Menterview.Domain.Entities;

namespace Menterview.Application.Contracts.Repository;

public interface ISessionRepository
{
    Task<(IReadOnlyCollection<SessionStory> Items, int Total)> GetPagedByUserAsync(
        Guid userId, int page, int pageSize, DateTime? from, DateTime? to, CancellationToken ct = default);

    Task<SessionStory?> GetByIdAndUserAsync(long sessionId, Guid userId, CancellationToken ct = default);

    Task<SessionStory?> GetWithAnswersAsync(long sessionId, Guid userId, CancellationToken ct = default);

    Task<IReadOnlyCollection<Answer>> GetAnswersBySessionAsync(long sessionId, Guid userId, CancellationToken ct = default);

    Task<IReadOnlyCollection<SessionStory>> GetRecentByUserAsync(Guid userId, int count, CancellationToken ct = default);

    Task<SessionStory> CreateAsync(SessionStory session, CancellationToken ct = default);

    Task UpdateAsync(SessionStory session, CancellationToken ct = default);
}
