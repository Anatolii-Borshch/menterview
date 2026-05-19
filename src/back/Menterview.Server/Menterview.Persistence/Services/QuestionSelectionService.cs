using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Session;
using Menterview.Application.Dtos.Sub;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class QuestionSelectionService : IQuestionSelectionService
{
    private readonly MenterviewDbContext _db;

    public QuestionSelectionService(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyCollection<SessionQuestionDto>> SelectQuestionsAsync(
        Guid userId,
        int? categoryId,
        int? difficultyId,
        IEnumerable<int> tagIds,
        int count,
        float weakTopicRatio,
        CancellationToken ct = default)
    {
        var tagIdList = tagIds.ToList();
        var weakCount = (int)Math.Floor(count * weakTopicRatio);
        var regularCount = count - weakCount;

        var weakQuestions = new List<SessionQuestionDto>();

        if (weakCount > 0)
        {
            var now = DateTime.UtcNow;
            var weakTopicsQuery = _db.WeakTopics
                .Include(w => w.OriginalQuestion)
                    .ThenInclude(q => q!.Category)
                .Include(w => w.OriginalQuestion)
                    .ThenInclude(q => q!.Difficulty)
                .Include(w => w.OriginalQuestion)
                    .ThenInclude(q => q!.QuestionTags)
                        .ThenInclude(qt => qt.Tag)
                .Where(w => w.UserId == userId && w.NextReviewAt <= now && w.OriginalQuestion != null && !w.OriginalQuestion.IsDeleted);

            if (categoryId.HasValue)
                weakTopicsQuery = weakTopicsQuery.Where(w => w.CategoryId == categoryId.Value);
            if (difficultyId.HasValue)
                weakTopicsQuery = weakTopicsQuery.Where(w => w.DifficultyId == difficultyId.Value);

            var weakTopics = await weakTopicsQuery
                .OrderBy(w => w.NextReviewAt)
                .Take(weakCount)
                .ToListAsync(ct);

            weakQuestions = weakTopics.Select(w => new SessionQuestionDto
            {
                QuestionId = w.OriginalQuestion!.QuestionId,
                QuestionText = w.OriginalQuestion.QuestionText,
                Answer = w.OriginalQuestion.Answer,
                RephrasedText = w.RephrasedQuestion,
                IsWeakTopicReview = true,
                Category = new CategoryDto
                {
                    CategoryId = w.OriginalQuestion.Category.CategoryId,
                    CategoryName = w.OriginalQuestion.Category.CategoryName
                },
                Difficulty = new DifficultyDto
                {
                    DifficultyId = w.OriginalQuestion.Difficulty.DifficultyId,
                    DifficultyName = w.OriginalQuestion.Difficulty.DifficultyName
                },
                Tags = w.OriginalQuestion.QuestionTags.Select(qt => new TagDto
                {
                    TagId = qt.TagId,
                    TagName = qt.Tag.TagName
                })
            }).ToList();
        }

        // Fill remaining slots with regular catalog questions
        var needed = count - weakQuestions.Count;
        var excludeIds = weakQuestions.Select(q => q.QuestionId).ToHashSet();

        var regularQuery = _db.Questions
            .Include(q => q.Category)
            .Include(q => q.Difficulty)
            .Include(q => q.QuestionTags)
                .ThenInclude(qt => qt.Tag)
            .Where(q => !q.IsDeleted && !excludeIds.Contains(q.QuestionId));

        if (categoryId.HasValue)
            regularQuery = regularQuery.Where(q => q.CategoryId == categoryId.Value);
        if (difficultyId.HasValue)
            regularQuery = regularQuery.Where(q => q.DifficultyId == difficultyId.Value);
        if (tagIdList.Count > 0)
            regularQuery = regularQuery.Where(q => q.QuestionTags.Any(qt => tagIdList.Contains(qt.TagId)));

        var regularQuestions = await regularQuery
            .OrderBy(q => Guid.NewGuid()) // random order
            .Take(needed)
            .ToListAsync(ct);

        var result = weakQuestions.Concat(regularQuestions.Select(q => new SessionQuestionDto
        {
            QuestionId = q.QuestionId,
            QuestionText = q.QuestionText,
            Answer = q.Answer,
            IsWeakTopicReview = false,
            Category = new CategoryDto
            {
                CategoryId = q.Category.CategoryId,
                CategoryName = q.Category.CategoryName
            },
            Difficulty = new DifficultyDto
            {
                DifficultyId = q.Difficulty.DifficultyId,
                DifficultyName = q.Difficulty.DifficultyName
            },
            Tags = q.QuestionTags.Select(qt => new TagDto
            {
                TagId = qt.TagId,
                TagName = qt.Tag.TagName
            })
        })).ToList();

        return result.AsReadOnly();
    }
}
