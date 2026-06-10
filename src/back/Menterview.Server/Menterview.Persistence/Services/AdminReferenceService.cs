using Menterview.Application.Contracts.Service;
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

    public async Task<LevelDto> CreateLevelAsync(string name, CancellationToken ct = default)
    {
        var level = new Level { LevelName = name };
        _db.Levels.Add(level);
        await _db.SaveChangesAsync(ct);
        return new LevelDto { LevelId = level.LevelId, LevelName = level.LevelName };
    }

    public async Task UpdateLevelAsync(int levelId, string name, CancellationToken ct = default)
    {
        var level = await _db.Levels.FindAsync([levelId], ct)
            ?? throw new KeyNotFoundException($"Level {levelId} not found.");
        level.LevelName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteLevelAsync(int levelId, CancellationToken ct = default)
    {
        var level = await _db.Levels.FindAsync([levelId], ct)
            ?? throw new KeyNotFoundException($"Level {levelId} not found.");
        _db.Levels.Remove(level);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<CountryDto> CreateCountryAsync(string name, CancellationToken ct = default)
    {
        var country = new Country { CountryName = name };
        _db.Countries.Add(country);
        await _db.SaveChangesAsync(ct);
        return new CountryDto { CountryId = country.CountryId, CountryName = country.CountryName };
    }

    public async Task UpdateCountryAsync(int countryId, string name, CancellationToken ct = default)
    {
        var country = await _db.Countries.FindAsync([countryId], ct)
            ?? throw new KeyNotFoundException($"Country {countryId} not found.");
        country.CountryName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteCountryAsync(int countryId, CancellationToken ct = default)
    {
        var country = await _db.Countries.FindAsync([countryId], ct)
            ?? throw new KeyNotFoundException($"Country {countryId} not found.");
        _db.Countries.Remove(country);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<LanguageDto> CreateLanguageAsync(string name, CancellationToken ct = default)
    {
        var language = new Language { LanguageName = name };
        _db.Languages.Add(language);
        await _db.SaveChangesAsync(ct);
        return new LanguageDto { LanguageId = language.LanguageId, LanguageName = language.LanguageName };
    }

    public async Task UpdateLanguageAsync(int languageId, string name, CancellationToken ct = default)
    {
        var language = await _db.Languages.FindAsync([languageId], ct)
            ?? throw new KeyNotFoundException($"Language {languageId} not found.");
        language.LanguageName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteLanguageAsync(int languageId, CancellationToken ct = default)
    {
        var language = await _db.Languages.FindAsync([languageId], ct)
            ?? throw new KeyNotFoundException($"Language {languageId} not found.");
        _db.Languages.Remove(language);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<RoleDto> CreateRoleAsync(string name, CancellationToken ct = default)
    {
        var role = new Role { RoleName = name };
        _db.Roles.Add(role);
        await _db.SaveChangesAsync(ct);
        return new RoleDto { RoleId = role.RoleId, RoleName = role.RoleName };
    }

    public async Task UpdateRoleAsync(int roleId, string name, CancellationToken ct = default)
    {
        var role = await _db.Roles.FindAsync([roleId], ct)
            ?? throw new KeyNotFoundException($"Role {roleId} not found.");
        role.RoleName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteRoleAsync(int roleId, CancellationToken ct = default)
    {
        var role = await _db.Roles.FindAsync([roleId], ct)
            ?? throw new KeyNotFoundException($"Role {roleId} not found.");
        _db.Roles.Remove(role);
        await _db.SaveChangesAsync(ct);
    }

    public async Task<ThemeDto> CreateThemeAsync(string name, CancellationToken ct = default)
    {
        var theme = new Theme { ThemeName = name };
        _db.Themes.Add(theme);
        await _db.SaveChangesAsync(ct);
        return new ThemeDto { ThemeId = theme.ThemeId, ThemeName = theme.ThemeName };
    }

    public async Task UpdateThemeAsync(int themeId, string name, CancellationToken ct = default)
    {
        var theme = await _db.Themes.FindAsync([themeId], ct)
            ?? throw new KeyNotFoundException($"Theme {themeId} not found.");
        theme.ThemeName = name;
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteThemeAsync(int themeId, CancellationToken ct = default)
    {
        var theme = await _db.Themes.FindAsync([themeId], ct)
            ?? throw new KeyNotFoundException($"Theme {themeId} not found.");
        _db.Themes.Remove(theme);
        await _db.SaveChangesAsync(ct);
    }
}
