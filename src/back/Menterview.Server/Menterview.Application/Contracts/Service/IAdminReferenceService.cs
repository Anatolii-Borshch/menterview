using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Contracts.Service;

public interface IAdminReferenceService
{
    Task<CategoryDto> CreateCategoryAsync(string name, CancellationToken ct = default);
    Task UpdateCategoryAsync(int categoryId, string name, CancellationToken ct = default);
    Task DeleteCategoryAsync(int categoryId, CancellationToken ct = default);

    Task<TagDto> CreateTagAsync(string name, CancellationToken ct = default);
    Task UpdateTagAsync(int tagId, string name, CancellationToken ct = default);
    Task DeleteTagAsync(int tagId, CancellationToken ct = default);

    Task<DifficultyDto> CreateDifficultyAsync(string name, CancellationToken ct = default);
    Task UpdateDifficultyAsync(int difficultyId, string name, CancellationToken ct = default);
    Task DeleteDifficultyAsync(int difficultyId, CancellationToken ct = default);

    Task<LevelDto> CreateLevelAsync(string name, CancellationToken ct = default);
    Task UpdateLevelAsync(int levelId, string name, CancellationToken ct = default);
    Task DeleteLevelAsync(int levelId, CancellationToken ct = default);

    Task<CountryDto> CreateCountryAsync(string name, CancellationToken ct = default);
    Task UpdateCountryAsync(int countryId, string name, CancellationToken ct = default);
    Task DeleteCountryAsync(int countryId, CancellationToken ct = default);

    Task<LanguageDto> CreateLanguageAsync(string name, CancellationToken ct = default);
    Task UpdateLanguageAsync(int languageId, string name, CancellationToken ct = default);
    Task DeleteLanguageAsync(int languageId, CancellationToken ct = default);

    Task<RoleDto> CreateRoleAsync(string name, CancellationToken ct = default);
    Task UpdateRoleAsync(int roleId, string name, CancellationToken ct = default);
    Task DeleteRoleAsync(int roleId, CancellationToken ct = default);

    Task<ThemeDto> CreateThemeAsync(string name, CancellationToken ct = default);
    Task UpdateThemeAsync(int themeId, string name, CancellationToken ct = default);
    Task DeleteThemeAsync(int themeId, CancellationToken ct = default);
}
