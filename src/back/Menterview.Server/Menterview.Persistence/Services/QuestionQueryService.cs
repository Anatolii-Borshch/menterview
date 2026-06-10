using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Question;
using Menterview.Application.Dtos.Sub;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class QuestionQueryService : IQuestionQueryService
{
    private readonly MenterviewDbContext _db;

    public QuestionQueryService(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<QuestionListItemDto>> GetQuestionsAsync(
        int page,
        int pageSize,
        int? categoryId,
        int? difficultyId,
        IEnumerable<int> tagIds,
        string? searchTerm,
        CancellationToken ct = default)
    {
        var questionsQuery = _db.Questions
            .Include(q => q.Category)
            .Include(q => q.Difficulty)
            .Include(q => q.QuestionTags)
                .ThenInclude(qt => qt.Tag)
            .AsNoTracking()
            .Where(q => !q.IsDeleted);

        if (categoryId.HasValue)
            questionsQuery = questionsQuery.Where(q => q.CategoryId == categoryId.Value);

        if (difficultyId.HasValue)
            questionsQuery = questionsQuery.Where(q => q.DifficultyId == difficultyId.Value);

        var tagIdList = tagIds.ToList();
        if (tagIdList.Count > 0)
            questionsQuery = questionsQuery.Where(q => q.QuestionTags.Any(qt => tagIdList.Contains(qt.TagId)));

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var normalizedSearch = searchTerm.Trim().ToLower();
            questionsQuery = questionsQuery.Where(q => q.QuestionText.ToLower().Contains(normalizedSearch));
        }

        var totalCount = await questionsQuery.CountAsync(ct);
        var items = await questionsQuery
            .OrderBy(q => q.QuestionId)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<QuestionListItemDto>
        {
            Items = items.Select(MapListItem),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<QuestionDetailsDto?> GetQuestionAsync(long questionId, CancellationToken ct = default)
    {
        var question = await _db.Questions
            .Include(q => q.Category)
            .Include(q => q.Difficulty)
            .Include(q => q.QuestionTags)
                .ThenInclude(qt => qt.Tag)
            .AsNoTracking()
            .FirstOrDefaultAsync(q => !q.IsDeleted && q.QuestionId == questionId, ct);

        return question is null ? null : MapDetails(question);
    }

    private static QuestionListItemDto MapListItem(Domain.Entities.Question question) => new()
    {
        QuestionId = question.QuestionId,
        QuestionText = question.QuestionText,
        Category = new CategoryDto
        {
            CategoryId = question.CategoryId,
            CategoryName = question.Category.CategoryName
        },
        Difficulty = new DifficultyDto
        {
            DifficultyId = question.DifficultyId,
            DifficultyName = question.Difficulty.DifficultyName
        },
        Tags = question.QuestionTags
            .OrderBy(qt => qt.TagId)
            .Select(qt => new TagDto
            {
                TagId = qt.TagId,
                TagName = qt.Tag.TagName
            })
    };

    private static QuestionDetailsDto MapDetails(Domain.Entities.Question question) => new()
    {
        QuestionId = question.QuestionId,
        QuestionText = question.QuestionText,
        Answer = question.Answer,
        Category = new CategoryDto
        {
            CategoryId = question.CategoryId,
            CategoryName = question.Category.CategoryName
        },
        Difficulty = new DifficultyDto
        {
            DifficultyId = question.DifficultyId,
            DifficultyName = question.Difficulty.DifficultyName
        },
        Tags = question.QuestionTags
            .OrderBy(qt => qt.TagId)
            .Select(qt => new TagDto
            {
                TagId = qt.TagId,
                TagName = qt.Tag.TagName
            })
    };
}