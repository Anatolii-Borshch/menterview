using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Sub;
using Menterview.Application.Dtos.WeakPoint;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class WeakTopicService : IWeakTopicService
{
    private readonly MenterviewDbContext _db;

    public WeakTopicService(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<WeakTopicDto>> GetWeakTopicsAsync(Guid userId, CancellationToken ct = default)
    {
        var topics = await _db.WeakTopics
            .Include(w => w.OriginalQuestion)
                .ThenInclude(q => q!.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
            .Include(w => w.Category)
            .Include(w => w.Difficulty)
            .AsNoTracking()
            .Where(w => w.UserId == userId && w.OriginalQuestion != null && !w.OriginalQuestion.IsDeleted)
            .ToListAsync(ct);

        return topics.Select(Map);
    }

    public async Task<IEnumerable<WeakTopicDto>> GetDueWeakTopicsAsync(Guid userId, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var topics = await _db.WeakTopics
            .Include(w => w.OriginalQuestion)
                .ThenInclude(q => q!.QuestionTags)
                    .ThenInclude(qt => qt.Tag)
            .Include(w => w.Category)
            .Include(w => w.Difficulty)
            .AsNoTracking()
            .Where(w => w.UserId == userId
                     && w.NextReviewAt <= now
                     && w.OriginalQuestion != null
                     && !w.OriginalQuestion.IsDeleted)
            .ToListAsync(ct);

        return topics.Select(Map);
    }

    public async Task DismissWeakTopicAsync(Guid userId, long weakTopicId, CancellationToken ct = default)
    {
        var topic = await _db.WeakTopics
            .FirstOrDefaultAsync(w => w.WeakTopicId == weakTopicId && w.UserId == userId, ct)
            ?? throw new KeyNotFoundException($"Weak topic {weakTopicId} not found.");

        _db.WeakTopics.Remove(topic);
        await _db.SaveChangesAsync(ct);
    }

    private static WeakTopicDto Map(Domain.Entities.WeakTopic w) => new()
    {
        WeakTopicId = w.WeakTopicId,
        OriginalQuestionId = w.OriginalQuestionId ?? 0,
        QuestionText = w.OriginalQuestion?.QuestionText ?? string.Empty,
        RephrasedQuestion = w.RephrasedQuestion,
        Category = w.Category != null
            ? new CategoryDto { CategoryId = w.Category.CategoryId, CategoryName = w.Category.CategoryName }
            : new CategoryDto(),
        Difficulty = new DifficultyDto { DifficultyId = w.Difficulty.DifficultyId, DifficultyName = w.Difficulty.DifficultyName },
        Tags = w.OriginalQuestion?.QuestionTags.Select(qt => new TagDto
        {
            TagId = qt.TagId,
            TagName = qt.Tag.TagName
        }) ?? [],
        RepeatCount = w.RepeatCount,
        EaseFactor = w.EaseFactor,
        NextReviewAt = w.NextReviewAt,
        LastAccuracy = 0 // not stored on WeakTopic; would need last Answer lookup if desired
    };
}
