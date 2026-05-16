using Menterview.Application.Contracts;
using Menterview.Application.Dtos.Sub;
using Menterview.Domain.Entities;
using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class AdminReferenceService : IAdminReferenceService
{
    private readonly MenterviewDbContext _db;

    public AdminReferenceService(MenterviewDbContext db)
    {
        _db = db;
    }

    // ── Categories ──────────────────────────────────────────────────────────

    public async Task<CategoryDto> CreateCategoryAsync(string name, CancellationToken ct = default)
    {
        var category = new Category { CategoryName = name };
        _db.Categories.Add(category);
        await _db.SaveChangesAsync(ct);
        return new CategoryDto { CategoryId = category.CategoryId, CategoryName = category.CategoryName };
    }

    public async Task UpdateCategoryAsync(int categoryId, string name, CancellationToken ct = default)
    {
        var category = await _db.Categories.FindAsync([categoryId], ct)
            ?? throw new KeyNotFoundException($"Category {categoryId} not found.");
        category.CategoryName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteCategoryAsync(int categoryId, CancellationToken ct = default)
    {
        var category = await _db.Categories.FindAsync([categoryId], ct)
            ?? throw new KeyNotFoundException($"Category {categoryId} not found.");
        _db.Categories.Remove(category);
        await _db.SaveChangesAsync(ct);
    }

    // ── Tags ────────────────────────────────────────────────────────────────

    public async Task<TagDto> CreateTagAsync(string name, CancellationToken ct = default)
    {
        var tag = new Tag { TagName = name };
        _db.Tags.Add(tag);
        await _db.SaveChangesAsync(ct);
        return new TagDto { TagId = tag.TagId, TagName = tag.TagName };
    }

    public async Task UpdateTagAsync(int tagId, string name, CancellationToken ct = default)
    {
        var tag = await _db.Tags.FindAsync([tagId], ct)
            ?? throw new KeyNotFoundException($"Tag {tagId} not found.");
        tag.TagName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteTagAsync(int tagId, CancellationToken ct = default)
    {
        var tag = await _db.Tags.FindAsync([tagId], ct)
            ?? throw new KeyNotFoundException($"Tag {tagId} not found.");
        _db.Tags.Remove(tag);
        await _db.SaveChangesAsync(ct);
    }

    // ── Difficulties ─────────────────────────────────────────────────────────

    public async Task<DifficultyDto> CreateDifficultyAsync(string name, CancellationToken ct = default)
    {
        var difficulty = new Difficulty { DifficultyName = name };
        _db.Difficulties.Add(difficulty);
        await _db.SaveChangesAsync(ct);
        return new DifficultyDto { DifficultyId = difficulty.DifficultyId, DifficultyName = difficulty.DifficultyName };
    }

    public async Task UpdateDifficultyAsync(int difficultyId, string name, CancellationToken ct = default)
    {
        var difficulty = await _db.Difficulties.FindAsync([difficultyId], ct)
            ?? throw new KeyNotFoundException($"Difficulty {difficultyId} not found.");
        difficulty.DifficultyName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteDifficultyAsync(int difficultyId, CancellationToken ct = default)
    {
        var difficulty = await _db.Difficulties.FindAsync([difficultyId], ct)
            ?? throw new KeyNotFoundException($"Difficulty {difficultyId} not found.");
        _db.Difficulties.Remove(difficulty);
        await _db.SaveChangesAsync(ct);
    }
}
