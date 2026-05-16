namespace Menterview.Application.Contracts.Profile;

public interface IProfileValidator
{
    Task ValidateUpdateProfileAsync(string firstName, string lastName, CancellationToken ct = default);
    Task ValidateCategoryAsync(int categoryId, CancellationToken ct = default);
    Task ValidateDifficultyAsync(int difficultyId, CancellationToken ct = default);
}
