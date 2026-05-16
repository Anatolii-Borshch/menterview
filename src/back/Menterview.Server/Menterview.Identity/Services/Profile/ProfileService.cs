using Menterview.Application.Contracts.Loggining;
using Menterview.Application.Contracts.Profile;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Dtos.Profile;
using Menterview.Application.Dtos.Sub;
using ApplicationUser = Menterview.Application.Models.Application.User;

namespace Menterview.Identity.Services.Profile;

public class ProfileService : IProfileService
{
    private readonly IUserRepository _userRepo;
    private readonly IProfileValidator _validator;
    private readonly IAppLogger<ProfileService> _logger;

    public ProfileService(
        IUserRepository userRepo,
        IProfileValidator validator,
        IAppLogger<ProfileService> logger)
    {
        _userRepo = userRepo;
        _validator = validator;
        _logger = logger;
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        return MapToDto(user);
    }

    public async Task UpdateProfileAsync(Guid userId, string firstName, string lastName, CancellationToken ct = default)
    {
        await _validator.ValidateUpdateProfileAsync(firstName, lastName, ct);

        await _userRepo.UpdateProfileAsync(userId, firstName.Trim(), lastName.Trim(), ct);
        _logger.LogInformation("User {UserId} updated profile name.", userId);
    }

    public async Task DeleteAccountAsync(Guid userId, CancellationToken ct = default)
    {
        await _userRepo.SoftDeleteAsync(userId, ct);
        _logger.LogInformation("User {UserId} deleted their account (soft delete).", userId);
    }

    public async Task UpdateCategoryAsync(Guid userId, int categoryId, CancellationToken ct = default)
    {
        await _validator.ValidateCategoryAsync(categoryId, ct);

        await _userRepo.UpdateCategoryAsync(userId, categoryId, ct);
        _logger.LogInformation("User {UserId} updated category to {CategoryId}.", userId, categoryId);
    }

    public async Task UpdateDifficultyAsync(Guid userId, int difficultyId, CancellationToken ct = default)
    {
        await _validator.ValidateDifficultyAsync(difficultyId, ct);

        await _userRepo.UpdateDifficultyAsync(userId, difficultyId, ct);
        _logger.LogInformation("User {UserId} updated difficulty to {DifficultyId}.", userId, difficultyId);
    }

    private static UserProfileDto MapToDto(ApplicationUser user)
    {
        var dto = new UserProfileDto
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.EmailAddress,
            CreatedAt = user.CreatedAt,
            Category = new CategoryDto
            {
                CategoryId = user.Category.CategoryId,
                CategoryName = user.Category.CategoryName
            },
            Difficulty = new DifficultyDto
            {
                DifficultyId = user.Difficulty.DifficultyId,
                DifficultyName = user.Difficulty.DifficultyName
            },
            Role = new RoleDto
            {
                RoleId = user.Role.RoleId,
                RoleName = user.Role.RoleName
            }
        };

        if (user.Setting is not null)
        {
            dto.Settings = new UserSettingsDto
            {
                Theme = new ThemeDto
                {
                    ThemeId = user.Setting.Theme.ThemeId,
                    ThemeName = user.Setting.Theme.ThemeName
                },
                Language = new LanguageDto
                {
                    LanguageId = user.Setting.Language.LanguageId,
                    LanguageName = user.Setting.Language.LanguageName
                },
                Country = new CountryDto
                {
                    CountryId = user.Setting.Country.CountryId,
                    CountryName = user.Setting.Country.CountryName
                }
            };
        }

        return dto;
    }
}
