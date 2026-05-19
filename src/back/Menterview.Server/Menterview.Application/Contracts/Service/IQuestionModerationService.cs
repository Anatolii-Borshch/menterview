using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Admin;
using Menterview.Application.Dtos.Question;
using Menterview.Domain.Enums;

namespace Menterview.Application.Contracts.Service;

public interface IQuestionModerationService
{
    Task<PagedResult<AdminQuestionListItemDto>> GetAllQuestionsAsync(
        int page, int pageSize, string? searchTerm, int? categoryId, int? difficultyId,
        IEnumerable<int> tagIds, bool includeDeleted, CancellationToken ct = default);

    Task<PagedResult<PendingQuestionDto>> GetPendingQuestionsAsync(
        int page, int pageSize, SuggestionType? type, CancellationToken ct = default);

    Task<PendingQuestionDetailsDto> GetPendingSuggestionAsync(long suggestionId, CancellationToken ct = default);

    Task ApproveSuggestionAsync(long suggestionId, CancellationToken ct = default);

    Task RejectSuggestionAsync(long suggestionId, string? rejectionReason, CancellationToken ct = default);

    Task DeleteQuestionAsync(long questionId, CancellationToken ct = default);

    Task<long> SuggestQuestionAsync(Guid userId, string questionText, string answer,
        int categoryId, int difficultyId, IEnumerable<int> tagIds, CancellationToken ct = default);
}
