using Menterview.Application.Dtos.WeakPoint;

namespace Menterview.Application.Contracts.Service;

public interface IWeakTopicService
{
    Task<IEnumerable<WeakTopicDto>> GetWeakTopicsAsync(Guid userId, CancellationToken ct = default);
    Task<IEnumerable<WeakTopicDto>> GetDueWeakTopicsAsync(Guid userId, CancellationToken ct = default);
    Task DismissWeakTopicAsync(Guid userId, long weakTopicId, CancellationToken ct = default);
}
