using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Implementations;

public class ReferenceService : IReferenceService
{
    private readonly IReferenceRepository _referenceRepo;

    public ReferenceService(IReferenceRepository referenceRepo)
    {
        _referenceRepo = referenceRepo;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default)
    {
        var categories = await _referenceRepo.GetCategoriesAsync(ct);
        return categories.Select(c => new CategoryDto
        {
            CategoryId = c.CategoryId,
            CategoryName = c.CategoryName
        });
    }

    public async Task<IEnumerable<DifficultyDto>> GetDifficultiesAsync(CancellationToken ct = default)
    {
        var difficulties = await _referenceRepo.GetDifficultiesAsync(ct);
        return difficulties.Select(d => new DifficultyDto
        {
            DifficultyId = d.DifficultyId,
            DifficultyName = d.DifficultyName
        });
    }

    public async Task<IEnumerable<TagDto>> GetTagsAsync(CancellationToken ct = default)
    {
        var tags = await _referenceRepo.GetTagsAsync(ct);
        return tags.Select(t => new TagDto
        {
            TagId = t.TagId,
            TagName = t.TagName
        });
    }

    public async Task<IEnumerable<LevelDto>> GetLevelsAsync(CancellationToken ct = default)
    {
        var levels = await _referenceRepo.GetLevelsAsync(ct);
        return levels.Select(l => new LevelDto
        {
            LevelId = l.LevelId,
            LevelName = l.LevelName
        });
    }
}
