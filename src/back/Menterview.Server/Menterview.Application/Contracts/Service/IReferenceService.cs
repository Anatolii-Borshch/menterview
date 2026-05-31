using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Contracts.Service;

public interface IReferenceService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    Task<IEnumerable<DifficultyDto>> GetDifficultiesAsync(CancellationToken ct = default);
    Task<IEnumerable<LevelDto>> GetLevelsAsync(CancellationToken ct = default);
    Task<IEnumerable<TagDto>> GetTagsAsync(CancellationToken ct = default);
    Task<IEnumerable<CountryDto>> GetCountriesAsync(CancellationToken ct = default);
    Task<IEnumerable<LanguageDto>> GetLanguagesAsync(CancellationToken ct = default);
    Task<IEnumerable<ThemeDto>> GetThemesAsync(CancellationToken ct = default);
    Task<IEnumerable<RoleDto>> GetRolesAsync(CancellationToken ct = default);
}
