using Menterview.Application.Dtos.Session;

namespace Menterview.Application.Contracts.Service;

public interface IQuestionSelectionService
{
    Task<IReadOnlyCollection<SessionQuestionDto>> SelectQuestionsAsync(
        Guid userId,
        int? categoryId,
        int? difficultyId,
        IEnumerable<int> tagIds,
        int count,
        float weakTopicRatio,
        CancellationToken ct = default);
}
