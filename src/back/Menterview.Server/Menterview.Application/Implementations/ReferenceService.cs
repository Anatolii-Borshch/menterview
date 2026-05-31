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

    public async Task<IEnumerable<CountryDto>> GetCountriesAsync(CancellationToken ct = default)
    {
        var items = await _referenceRepo.GetCountriesAsync(ct);
        return items.Select(c => new CountryDto { CountryId = c.CountryId, CountryName = c.CountryName });
    }

    public async Task<IEnumerable<LanguageDto>> GetLanguagesAsync(CancellationToken ct = default)
    {
        var items = await _referenceRepo.GetLanguagesAsync(ct);
        return items.Select(l => new LanguageDto { LanguageId = l.LanguageId, LanguageName = l.LanguageName });
    }

    public async Task<IEnumerable<ThemeDto>> GetThemesAsync(CancellationToken ct = default)
    {
        var items = await _referenceRepo.GetThemesAsync(ct);
        return items.Select(t => new ThemeDto { ThemeId = t.ThemeId, ThemeName = t.ThemeName });
    }

    public async Task<IEnumerable<RoleDto>> GetRolesAsync(CancellationToken ct = default)
    {
        var items = await _referenceRepo.GetRolesAsync(ct);
        return items.Select(r => new RoleDto { RoleId = r.RoleId, RoleName = r.RoleName });
    }
}
