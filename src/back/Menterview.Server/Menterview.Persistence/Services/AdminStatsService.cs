using Menterview.Application.Contracts;
using Menterview.Application.Dtos.Stats;
using Menterview.Domain.Enums;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class AdminStatsService : IAdminStatsService
{
    private readonly MenterviewDbContext _db;

    public AdminStatsService(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<SystemStatsDto> GetSystemStatsAsync(CancellationToken ct = default)
    {
        var totalUsers = await _db.Users.CountAsync(ct);
        var activeUsers = await _db.Users.CountAsync(u => !u.IsDeleted, ct);
        var totalQuestions = await _db.Questions.CountAsync(q => !q.IsDeleted, ct);
        var pendingApprovals = await _db.NewQuestions.CountAsync(q => q.Status == SuggestionStatus.Pending, ct);
        var totalSessions = await _db.SessionStories.CountAsync(ct);
        var avgAccuracy = await _db.Answers.AverageAsync(a => (double?)a.Accuracy, ct) ?? 0;

        return new SystemStatsDto
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            TotalQuestions = totalQuestions,
            PendingApprovals = pendingApprovals,
            TotalSessions = totalSessions,
            GlobalAverageAccuracy = avgAccuracy
        };
    }

    public async Task<UserStatsDto> GetUserStatsAsync(DateTime? from, DateTime? to, StatsGranularity granularity, CancellationToken ct = default)
    {
        var query = _db.Users.AsNoTracking();
        if (from.HasValue) query = query.Where(u => u.CreatedAt >= from.Value);
        if (to.HasValue)   query = query.Where(u => u.CreatedAt <= to.Value);

        var totalUsers = await query.CountAsync(ct);
        var deletedUsers = await query.CountAsync(u => u.IsDeleted, ct);

        var registrations = await query.ToListAsync(ct);

        var trend = BuildTrend(
            registrations.Select(u => u.CreatedAt),
            from, to, granularity);

        return new UserStatsDto
        {
            TotalUsers = totalUsers,
            DeletedUsers = deletedUsers,
            RegistrationTrend = trend
        };
    }

    public async Task<QuestionStatsDto> GetQuestionStatsAsync(DateTime? from, DateTime? to, StatsGranularity granularity, CancellationToken ct = default)
    {
        var query = _db.NewQuestions.AsNoTracking();
        if (from.HasValue) query = query.Where(q => q.CreatedAt >= from.Value);
        if (to.HasValue)   query = query.Where(q => q.CreatedAt <= to.Value);

        var total = await query.CountAsync(ct);
        var pending = await query.CountAsync(q => q.Status == SuggestionStatus.Pending, ct);
        var rejected = await query.CountAsync(q => q.Status == SuggestionStatus.Rejected, ct);
        var deletedCatalog = await _db.Questions.CountAsync(q => q.IsDeleted, ct);

        var submissions = await query.ToListAsync(ct);
        var trend = BuildTrend(submissions.Select(q => q.CreatedAt), from, to, granularity);

        return new QuestionStatsDto
        {
            TotalQuestions = total,
            PendingApprovals = pending,
            RejectedCount = rejected,
            DeletedCount = deletedCatalog,
            SubmissionTrend = trend
        };
    }

    public async Task<GlobalSessionStatsDto> GetSessionStatsAsync(DateTime? from, DateTime? to, StatsGranularity granularity, CancellationToken ct = default)
    {
        var query = _db.SessionStories.AsNoTracking();
        if (from.HasValue) query = query.Where(s => s.Time >= from.Value);
        if (to.HasValue)   query = query.Where(s => s.Time <= to.Value);

        var total = await query.CountAsync(ct);
        var sessions = await query.Include(s => s.Answers).ToListAsync(ct);

        var allAnswers = sessions.SelectMany(s => s.Answers).ToList();
        var avgAccuracy = allAnswers.Any() ? allAnswers.Average(a => a.Accuracy) : 0;
        var avgTime = sessions.Any() ? sessions.Average(s => s.TotalTime) : 0;

        var trend = BuildTrend(sessions.Select(s => s.Time), from, to, granularity);

        return new GlobalSessionStatsDto
        {
            TotalSessions = total,
            GlobalAverageAccuracy = avgAccuracy,
            GlobalAverageTime = avgTime,
            SessionTrend = trend
        };
    }

    private static IEnumerable<StatsTrendPointDto> BuildTrend(
        IEnumerable<DateTime> dates, DateTime? from, DateTime? to, StatsGranularity granularity)
    {
        var start = from ?? (dates.Any() ? dates.Min() : DateTime.UtcNow.Date.AddDays(-30));
        var end = to ?? DateTime.UtcNow;

        return granularity switch
        {
            StatsGranularity.Month => dates
                .GroupBy(d => new DateTime(d.Year, d.Month, 1))
                .Select(g => new StatsTrendPointDto { Date = g.Key, Count = g.Count() })
                .OrderBy(p => p.Date),
            StatsGranularity.Week => dates
                .GroupBy(d => d.Date.AddDays(-(int)d.DayOfWeek))
                .Select(g => new StatsTrendPointDto { Date = g.Key, Count = g.Count() })
                .OrderBy(p => p.Date),
            _ => dates
                .GroupBy(d => d.Date)
                .Select(g => new StatsTrendPointDto { Date = g.Key, Count = g.Count() })
                .OrderBy(p => p.Date)
        };
    }
}
