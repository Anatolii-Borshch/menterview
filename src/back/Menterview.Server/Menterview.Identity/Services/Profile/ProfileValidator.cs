using Menterview.Application.Contracts.Profile;
using Menterview.Application.Contracts.Repository;

namespace Menterview.Identity.Services.Profile;

public class ProfileValidator : IProfileValidator
{
    private const int NameMinLength = 1;
    private const int NameMaxLength = 64;

    private readonly IReferenceRepository _referenceRepo;

    public ProfileValidator(IReferenceRepository referenceRepo)
    {
        _referenceRepo = referenceRepo;
    }

    public Task ValidateUpdateProfileAsync(string firstName, string lastName, CancellationToken ct = default)
    {
        ValidateName(firstName, nameof(firstName));
        ValidateName(lastName, nameof(lastName));
        return Task.CompletedTask;
    }

    public async Task ValidateCategoryAsync(int categoryId, CancellationToken ct = default)
    {
        if (categoryId <= 0)
            throw new ArgumentException("Category id must be a positive integer.", nameof(categoryId));

        if (!await _referenceRepo.CategoryExistsAsync(categoryId, ct))
            throw new KeyNotFoundException($"Category {categoryId} not found.");
    }

    public async Task ValidateDifficultyAsync(int difficultyId, CancellationToken ct = default)
    {
        if (difficultyId <= 0)
            throw new ArgumentException("Difficulty id must be a positive integer.", nameof(difficultyId));

        if (!await _referenceRepo.DifficultyExistsAsync(difficultyId, ct))
            throw new KeyNotFoundException($"Difficulty {difficultyId} not found.");
    }

    public async Task ValidateLevelAsync(int levelId, CancellationToken ct = default)
    {
        if (levelId <= 0)
            throw new ArgumentException("Level id must be a positive integer.", nameof(levelId));

        if (!await _referenceRepo.LevelExistsAsync(levelId, ct))
            throw new KeyNotFoundException($"Level {levelId} not found.");
    }

    private static void ValidateName(string value, string field)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException($"{field} must not be empty.", field);

        var trimmed = value.Trim();
        if (trimmed.Length is < NameMinLength or > NameMaxLength)
            throw new ArgumentException(
                $"{field} length must be between {NameMinLength} and {NameMaxLength} characters.",
                field);
    }
}
