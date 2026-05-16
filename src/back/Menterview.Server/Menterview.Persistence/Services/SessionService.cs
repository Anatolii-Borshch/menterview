using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Session;
using Menterview.Application.Dtos.Sub;
using Microsoft.EntityFrameworkCore;
using Menterview.Persistence.DbContext;

namespace Menterview.Persistence.Services;

public class SessionService : ISessionService
{
    private readonly ISessionRepository _sessionRepo;
    private readonly MenterviewDbContext _db;

    public SessionService(ISessionRepository sessionRepo, MenterviewDbContext db)
    {
        _sessionRepo = sessionRepo;
        _db = db;
    }

    public async Task<PagedResult<SessionListItemDto>> GetHistoryAsync(
        Guid userId, int page, int pageSize, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var (items, total) = await _sessionRepo.GetPagedByUserAsync(userId, page, pageSize, from, to, ct);

        return new PagedResult<SessionListItemDto>
        {
            Items = items.Select(s => MapToListItem(s)),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<SessionDetailsDto> GetDetailsAsync(Guid userId, long sessionId, CancellationToken ct = default)
    {
        var session = await _sessionRepo.GetWithAnswersAsync(sessionId, userId, ct)
                      ?? throw new KeyNotFoundException($"Session {sessionId} not found.");

        var avgAccuracy = session.Answers.Any()
            ? session.Answers.Average(a => a.Accuracy)
            : 0.0;

        return new SessionDetailsDto
        {
            SessionId = session.SessionId,
            Time = session.Time,
            QuestionsAmount = session.QuestionsAmount,
            AnsweredCount = session.AnsweredCount,
            TotalTime = session.TotalTime,
            AverageAccuracy = avgAccuracy,
            Category = session.Category != null
                ? new CategoryDto { CategoryId = session.Category.CategoryId, CategoryName = session.Category.CategoryName }
                : new CategoryDto(),
            Difficulty = session.Difficulty != null
                ? new DifficultyDto { DifficultyId = session.Difficulty.DifficultyId, DifficultyName = session.Difficulty.DifficultyName }
                : new DifficultyDto(),
            Answers = session.Answers.Select(MapToBreakdown)
        };
    }

    public async Task<IEnumerable<AnswerBreakdownDto>> GetAnswerBreakdownAsync(Guid userId, long sessionId, CancellationToken ct = default)
    {
        var answers = await _sessionRepo.GetAnswersBySessionAsync(sessionId, userId, ct);
        return answers.Select(MapToBreakdown);
    }

    public async Task<UserSessionStatsDto> GetStatsAsync(Guid userId, DateTime? from, DateTime? to, int? lastN, CancellationToken ct = default)
    {
        var count = lastN ?? 10;
        var sessions = await _sessionRepo.GetRecentByUserAsync(userId, Math.Max(count, 100), ct);

        var filtered = sessions
            .Where(s => (!from.HasValue || s.Time >= from.Value) && (!to.HasValue || s.Time <= to.Value))
            .OrderByDescending(s => s.Time)
            .Take(count)
            .ToList();

        var allAnswers = filtered.SelectMany(s => s.Answers).ToList();

        var trend = filtered.Select(s => new SessionTrendPointDto
        {
            SessionId = s.SessionId,
            Time = s.Time,
            AverageAccuracy = s.Answers.Any() ? s.Answers.Average(a => a.Accuracy) : 0,
            TotalTime = s.TotalTime,
            AnsweredCount = s.AnsweredCount
        });

        // Per-category accuracy: join answers → questions → categories
        var categoryAccuracy = allAnswers
            .GroupBy(a => new { a.Question.CategoryId, a.Question.Category.CategoryName })
            .Select(g => new CategoryAccuracyDto
            {
                Category = new CategoryDto { CategoryId = g.Key.CategoryId, CategoryName = g.Key.CategoryName },
                AverageAccuracy = g.Average(a => a.Accuracy),
                TotalAnswers = g.Count()
            });

        var difficultyAccuracy = allAnswers
            .GroupBy(a => new { a.Question.DifficultyId, a.Question.Difficulty.DifficultyName })
            .Select(g => new DifficultyAccuracyDto
            {
                Difficulty = new DifficultyDto { DifficultyId = g.Key.DifficultyId, DifficultyName = g.Key.DifficultyName },
                AverageAccuracy = g.Average(a => a.Accuracy),
                TotalAnswers = g.Count()
            });

        return new UserSessionStatsDto
        {
            Trend = trend,
            OverallAverageAccuracy = allAnswers.Any() ? allAnswers.Average(a => a.Accuracy) : 0,
            OverallAverageTime = filtered.Any() ? filtered.Average(s => s.TotalTime) : 0,
            TotalSessionsCount = filtered.Count,
            AccuracyByCategory = categoryAccuracy,
            AccuracyByDifficulty = difficultyAccuracy
        };
    }

    private static SessionListItemDto MapToListItem(Domain.Entities.SessionStory s)
    {
        return new SessionListItemDto
        {
            SessionId = s.SessionId,
            Time = s.Time,
            QuestionsAmount = s.QuestionsAmount,
            AnsweredCount = s.AnsweredCount,
            TotalTime = s.TotalTime,
            AverageAccuracy = s.Answers.Any() ? s.Answers.Average(a => a.Accuracy) : 0,
            Category = s.Category != null
                ? new CategoryDto { CategoryId = s.Category.CategoryId, CategoryName = s.Category.CategoryName }
                : new CategoryDto(),
            Difficulty = s.Difficulty != null
                ? new DifficultyDto { DifficultyId = s.Difficulty.DifficultyId, DifficultyName = s.Difficulty.DifficultyName }
                : new DifficultyDto()
        };
    }

    private static AnswerBreakdownDto MapToBreakdown(Domain.Entities.Answer a)
    {
        return new AnswerBreakdownDto
        {
            AnswerId = a.AnswerId,
            QuestionText = a.Question.QuestionText,
            RephrasedText = a.RephrasedText,
            AnswerText = a.AnswerText,
            AiReply = a.AiReply,
            Accuracy = a.Accuracy,
            Correctness = a.Correctness,
            Completeness = a.Completeness,
            AnsweringTime = a.AnsweringTime,
            WasRephrased = a.WasRephrased,
            WasWeakTopicReview = a.WasWeakTopicReview,
            Category = new CategoryDto
            {
                CategoryId = a.Question.Category.CategoryId,
                CategoryName = a.Question.Category.CategoryName
            },
            Difficulty = new DifficultyDto
            {
                DifficultyId = a.Question.Difficulty.DifficultyId,
                DifficultyName = a.Question.Difficulty.DifficultyName
            }
        };
    }
}
