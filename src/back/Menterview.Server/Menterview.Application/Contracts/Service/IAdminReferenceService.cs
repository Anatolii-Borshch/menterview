using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Contracts.Service;

public interface IAdminReferenceService
{
    // Categories
    Task<CategoryDto> CreateCategoryAsync(string name, CancellationToken ct = default);
    Task UpdateCategoryAsync(int categoryId, string name, CancellationToken ct = default);
    Task DeleteCategoryAsync(int categoryId, CancellationToken ct = default);

    // Tags
    Task<TagDto> CreateTagAsync(string name, CancellationToken ct = default);
    Task UpdateTagAsync(int tagId, string name, CancellationToken ct = default);
    Task DeleteTagAsync(int tagId, CancellationToken ct = default);

    // Difficulties
    Task<DifficultyDto> CreateDifficultyAsync(string name, CancellationToken ct = default);
    Task UpdateDifficultyAsync(int difficultyId, string name, CancellationToken ct = default);
    Task DeleteDifficultyAsync(int difficultyId, CancellationToken ct = default);
}
