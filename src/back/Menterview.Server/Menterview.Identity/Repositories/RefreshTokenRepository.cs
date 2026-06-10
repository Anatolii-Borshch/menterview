using Menterview.Application.Contracts.Repository;
using Menterview.Application.Models.Security;
using Menterview.Identity.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Identity.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly MenterviewIdentityDbContext _context;

    public RefreshTokenRepository(MenterviewIdentityDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken?> GetActiveByTokenAsync(string token, CancellationToken ct = default)
        => await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token
                                    && rt.RevokedAt == null
                                    && rt.ExpiresAt > DateTime.UtcNow, ct);

    public async Task SaveAsync(RefreshToken token, CancellationToken ct = default)
    {
        var existing = await _context.RefreshTokens.FindAsync([token.Id], ct);

        if (existing is null)
            await _context.RefreshTokens.AddAsync(token, ct);
        else
            _context.RefreshTokens.Update(token);

        await _context.SaveChangesAsync(ct);
    }

    public async Task RevokeAllForUserAsync(string identityUserId, CancellationToken ct = default)
    {
        var tokens = await _context.RefreshTokens
            .Where(rt => rt.IdentityUserId == identityUserId && rt.RevokedAt == null)
            .ToListAsync(ct);

        foreach (var token in tokens)
            token.RevokedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyCollection<RefreshToken>> GetAllAsync()
        => await _context.RefreshTokens.ToListAsync();

    public async Task<RefreshToken> GetByIdAsync(long id)
        => await _context.RefreshTokens.FindAsync(id)
           ?? throw new KeyNotFoundException($"RefreshToken {id} not found.");

    public async Task AddAsync(RefreshToken entity)
    {
        await _context.RefreshTokens.AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(RefreshToken entity)
    {
        _context.RefreshTokens.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(RefreshToken entity)
    {
        _context.RefreshTokens.Remove(entity);
        await _context.SaveChangesAsync();
    }
}