using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Admin;
using Menterview.Application.Dtos.Question;
using Menterview.Application.Dtos.Sub;
using Menterview.Domain.Entities;
using Menterview.Domain.Enums;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class QuestionModerationService : IQuestionModerationService
{
    private readonly MenterviewDbContext _db;

    public QuestionModerationService(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<AdminQuestionListItemDto>> GetAllQuestionsAsync(
        int page, int pageSize, string? searchTerm, int? categoryId, int? difficultyId,
        IEnumerable<int> tagIds, bool includeDeleted, CancellationToken ct = default)
    {
        var query = _db.Questions
            .Include(q => q.Category)
            .Include(q => q.Difficulty)
            .Include(q => q.QuestionTags).ThenInclude(qt => qt.Tag)
            .Include(q => q.CreatedBy)
            .AsNoTracking();

        if (!includeDeleted)
            query = query.Where(q => !q.IsDeleted);

        if (categoryId.HasValue)
            query = query.Where(q => q.CategoryId == categoryId.Value);

        if (difficultyId.HasValue)
            query = query.Where(q => q.DifficultyId == difficultyId.Value);

        var tagIdList = tagIds.ToList();
        if (tagIdList.Count > 0)
            query = query.Where(q => q.QuestionTags.Any(qt => tagIdList.Contains(qt.TagId)));

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lower = searchTerm.ToLower();
            query = query.Where(q => q.QuestionText.ToLower().Contains(lower));
        }

        var total = await query.CountAsync(ct);
        var questions = await query
            .OrderBy(q => q.QuestionId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<AdminQuestionListItemDto>
        {
            Items = questions.Select(q => new AdminQuestionListItemDto
            {
                QuestionId = q.QuestionId,
                QuestionText = q.QuestionText,
                Category = new CategoryDto { CategoryId = q.CategoryId, CategoryName = q.Category.CategoryName },
                Difficulty = new DifficultyDto { DifficultyId = q.DifficultyId, DifficultyName = q.Difficulty.DifficultyName },
                Tags = q.QuestionTags.Select(qt => new TagDto { TagId = qt.TagId, TagName = qt.Tag.TagName }),
                IsDeleted = q.IsDeleted,
                CreatedByUserId = q.CreatedByUserId,
                CreatedByName = q.CreatedBy != null ? $"{q.CreatedBy.FirstName} {q.CreatedBy.LasName}" : null
            }),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<PendingQuestionDto>> GetPendingQuestionsAsync(
        int page, int pageSize, SuggestionType? type, CancellationToken ct = default)
    {
        var query = _db.NewQuestions
            .Include(nq => nq.User)
            .AsNoTracking()
            .Where(nq => nq.Status == SuggestionStatus.Pending);

        if (type.HasValue)
            query = query.Where(nq => nq.Type == type.Value);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderBy(nq => nq.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<PendingQuestionDto>
        {
            Items = items.Select(nq => new PendingQuestionDto
            {
                SuggestionId = nq.SuggestionId,
                QuestionText = nq.Question,
                Type = nq.Type,
                Status = nq.Status,
                SubmittedByUserId = nq.UserId,
                SubmittedByName = nq.User != null ? $"{nq.User.FirstName} {nq.User.LasName}" : null,
                CreatedAt = nq.CreatedAt
            }),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PendingQuestionDetailsDto> GetPendingSuggestionAsync(long suggestionId, CancellationToken ct = default)
    {
        var nq = await _db.NewQuestions
            .Include(x => x.User)
            .Include(x => x.Category)
            .Include(x => x.Difficulty)
            .Include(x => x.Tags).ThenInclude(t => t.Tag)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.SuggestionId == suggestionId, ct)
            ?? throw new KeyNotFoundException($"Suggestion {suggestionId} not found.");

        return new PendingQuestionDetailsDto
        {
            SuggestionId = nq.SuggestionId,
            QuestionText = nq.Question,
            Answer = nq.Answer,
            Type = nq.Type,
            Status = nq.Status,
            SubmittedByUserId = nq.UserId,
            SubmittedByName = nq.User != null ? $"{nq.User.FirstName} {nq.User.LasName}" : null,
            CreatedAt = nq.CreatedAt,
            Category = new CategoryDto { CategoryId = nq.CategoryId, CategoryName = nq.Category.CategoryName },
            Difficulty = new DifficultyDto { DifficultyId = nq.DifficultyId, DifficultyName = nq.Difficulty.DifficultyName },
            Tags = nq.Tags.Select(t => new TagDto { TagId = t.TagId, TagName = t.Tag.TagName })
        };
    }

    public async Task ApproveSuggestionAsync(long suggestionId, CancellationToken ct = default)
    {
        var nq = await _db.NewQuestions
            .Include(x => x.Tags)
            .FirstOrDefaultAsync(x => x.SuggestionId == suggestionId, ct)
            ?? throw new KeyNotFoundException($"Suggestion {suggestionId} not found.");

        if (nq.Status != SuggestionStatus.Pending)
            throw new InvalidOperationException($"Suggestion is already {nq.Status}.");

        var question = new Question
        {
            QuestionText = nq.Question,
            Answer = nq.Answer,
            CategoryId = nq.CategoryId,
            DifficultyId = nq.DifficultyId,
            CreatedByUserId = nq.UserId,
            IsDeleted = false
        };

        _db.Questions.Add(question);
        await _db.SaveChangesAsync(ct);

        foreach (var tag in nq.Tags)
        {
            _db.QuestionTags.Add(new QuestionTag
            {
                QuestionId = question.QuestionId,
                TagId = tag.TagId
            });
        }

        nq.Status = SuggestionStatus.Approved;
        await _db.SaveChangesAsync(ct);
    }

    public async Task RejectSuggestionAsync(long suggestionId, string? rejectionReason, CancellationToken ct = default)
    {
        var nq = await _db.NewQuestions
            .FirstOrDefaultAsync(x => x.SuggestionId == suggestionId, ct)
            ?? throw new KeyNotFoundException($"Suggestion {suggestionId} not found.");

        if (nq.Status != SuggestionStatus.Pending)
            throw new InvalidOperationException($"Suggestion is already {nq.Status}.");

        nq.Status = SuggestionStatus.Rejected;
        nq.RejectionReason = rejectionReason;
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdatePendingSuggestionTagsAsync(long suggestionId, IEnumerable<int> tagIds, CancellationToken ct = default)
    {
        var nq = await _db.NewQuestions
            .Include(x => x.Tags)
            .FirstOrDefaultAsync(x => x.SuggestionId == suggestionId, ct)
            ?? throw new KeyNotFoundException($"Suggestion {suggestionId} not found.");

        if (nq.Status != SuggestionStatus.Pending)
            throw new InvalidOperationException($"Suggestion is already {nq.Status}.");

        var tagIdList = tagIds?.Distinct().ToList() ?? [];
        if (!tagIdList.Any())
            throw new ArgumentException("At least one tag is required.", nameof(tagIds));

        _db.NewQuestionTags.RemoveRange(nq.Tags);

        foreach (var tagId in tagIdList)
        {
            _db.NewQuestionTags.Add(new NewQuestionTag
            {
                SuggestionId = nq.SuggestionId,
                TagId = tagId
            });
        }

        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteQuestionAsync(long questionId, CancellationToken ct = default)
    {
        var question = await _db.Questions
            .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct)
            ?? throw new KeyNotFoundException($"Question {questionId} not found.");

        question.IsDeleted = true;
        question.DeletedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
    }

    public async Task<long> SuggestQuestionAsync(Guid userId, string questionText, string answer,
        int categoryId, int difficultyId, IEnumerable<int> tagIds, CancellationToken ct = default)
    {
        var tagIdList = tagIds?.Distinct().ToList() ?? [];
        if (!tagIdList.Any())
            throw new ArgumentException("At least one tag is required.", nameof(tagIds));

        var suggestion = new NewQuestion
        {
            Question = questionText,
            Answer = answer,
            CategoryId = categoryId,
            DifficultyId = difficultyId,
            UserId = userId,
            Status = SuggestionStatus.Pending,
            Type = SuggestionType.New,
            CreatedAt = DateTime.UtcNow,
            Tags = tagIdList.Select(tid => new NewQuestionTag { TagId = tid }).ToList()
        };

        _db.NewQuestions.Add(suggestion);
        await _db.SaveChangesAsync(ct);
        return suggestion.SuggestionId;
    }
}
