using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Question;

namespace Menterview.Application.Contracts.Service;

public interface IQuestionQueryService
{
    Task<PagedResult<QuestionListItemDto>> GetQuestionsAsync(
        int page,
        int pageSize,
        int? categoryId,
        int? difficultyId,
        IEnumerable<int> tagIds,
        string? searchTerm,
        CancellationToken ct = default);

    Task<QuestionDetailsDto?> GetQuestionAsync(long questionId, CancellationToken ct = default);
}