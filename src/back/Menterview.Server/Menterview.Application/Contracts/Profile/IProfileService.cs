using Menterview.Application.Dtos.Profile;

namespace Menterview.Application.Contracts.Profile;

public interface IProfileService
{
    Task<UserProfileDto> GetProfileAsync(Guid userId, CancellationToken ct = default);
    Task UpdateProfileAsync(Guid userId, string firstName, string lastName, CancellationToken ct = default);
    Task DeleteAccountAsync(Guid userId, CancellationToken ct = default);
    Task UpdateCategoryAsync(Guid userId, int categoryId, CancellationToken ct = default);
    Task UpdateDifficultyAsync(Guid userId, int difficultyId, CancellationToken ct = default);
}
