using Menterview.Application.Contracts.Repository;
using Menterview.Domain.Entities;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Repositories;

public class ReferenceRepository : IReferenceRepository
{
    private readonly MenterviewDbContext _businessDb;

    public ReferenceRepository(MenterviewDbContext businessDb)
    {
        _businessDb = businessDb;
    }

    public Task<bool> CategoryExistsAsync(int categoryId, CancellationToken ct = default)
        => _businessDb.Categories.AnyAsync(c => c.CategoryId == categoryId, ct);

    public Task<bool> DifficultyExistsAsync(int difficultyId, CancellationToken ct = default)
        => _businessDb.Difficulties.AnyAsync(d => d.DifficultyId == difficultyId, ct);

    public Task<bool> LevelExistsAsync(int levelId, CancellationToken ct = default)
        => _businessDb.Levels.AnyAsync(l => l.LevelId == levelId, ct);

    public async Task<IEnumerable<Category>> GetCategoriesAsync(CancellationToken ct = default)
        => await _businessDb.Categories.AsNoTracking().ToListAsync(ct);

    public async Task<IEnumerable<Difficulty>> GetDifficultiesAsync(CancellationToken ct = default)
        => await _businessDb.Difficulties.AsNoTracking().ToListAsync(ct);

    public async Task<IEnumerable<Level>> GetLevelsAsync(CancellationToken ct = default)
        => await _businessDb.Levels.AsNoTracking().ToListAsync(ct);

    public async Task<IEnumerable<Tag>> GetTagsAsync(CancellationToken ct = default)
        => await _businessDb.Tags.AsNoTracking().ToListAsync(ct);
}
