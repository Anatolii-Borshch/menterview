using Menterview.Application.Contracts.Repository;
using Menterview.Domain.Entities;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Repositories;

public class SessionRepository : ISessionRepository
{
    private readonly MenterviewDbContext _db;

    public SessionRepository(MenterviewDbContext db)
    {
        _db = db;
    }

    public async Task<(IReadOnlyCollection<SessionStory> Items, int Total)> GetPagedByUserAsync(
        Guid userId, int page, int pageSize, DateTime? from, DateTime? to, CancellationToken ct = default)
    {
        var query = _db.SessionStories
            .Include(s => s.Category)
            .Include(s => s.Difficulty)
            .AsNoTracking()
            .Where(s => s.UserId == userId);

        if (from.HasValue) query = query.Where(s => s.Time >= from.Value);
        if (to.HasValue)   query = query.Where(s => s.Time <= to.Value);

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(s => s.Time)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items.AsReadOnly(), total);
    }

    public async Task<SessionStory?> GetByIdAndUserAsync(long sessionId, Guid userId, CancellationToken ct = default)
    {
        return await _db.SessionStories
            .Include(s => s.Category)
            .Include(s => s.Difficulty)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.UserId == userId, ct);
    }

    public async Task<SessionStory?> GetWithAnswersAsync(long sessionId, Guid userId, CancellationToken ct = default)
    {
        return await _db.SessionStories
            .Include(s => s.Category)
            .Include(s => s.Difficulty)
            .Include(s => s.Answers)
                .ThenInclude(a => a.Question)
                    .ThenInclude(q => q.Category)
            .Include(s => s.Answers)
                .ThenInclude(a => a.Question)
                    .ThenInclude(q => q.Difficulty)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.SessionId == sessionId && s.UserId == userId, ct);
    }

    public async Task<IReadOnlyCollection<Answer>> GetAnswersBySessionAsync(long sessionId, Guid userId, CancellationToken ct = default)
    {
        var session = await _db.SessionStories
            .AsNoTracking()
            .AnyAsync(s => s.SessionId == sessionId && s.UserId == userId, ct);

        if (!session)
            return Array.Empty<Answer>();

        return await _db.Answers
            .Include(a => a.Question)
                .ThenInclude(q => q.Category)
            .Include(a => a.Question)
                .ThenInclude(q => q.Difficulty)
            .AsNoTracking()
            .Where(a => a.SessionId == sessionId)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyCollection<SessionStory>> GetRecentByUserAsync(Guid userId, int count, CancellationToken ct = default)
    {
        return await _db.SessionStories
            .Include(s => s.Answers)
                .ThenInclude(a => a.Question)
                    .ThenInclude(q => q.Category)
            .Include(s => s.Answers)
                .ThenInclude(a => a.Question)
                    .ThenInclude(q => q.Difficulty)
            .Include(s => s.Category)
            .Include(s => s.Difficulty)
            .AsNoTracking()
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.Time)
            .Take(count)
            .ToListAsync(ct);
    }

    public async Task<SessionStory> CreateAsync(SessionStory session, CancellationToken ct = default)
    {
        _db.SessionStories.Add(session);
        await _db.SaveChangesAsync(ct);
        return session;
    }

    public async Task UpdateAsync(SessionStory session, CancellationToken ct = default)
    {
        _db.SessionStories.Update(session);
        await _db.SaveChangesAsync(ct);
    }
}
