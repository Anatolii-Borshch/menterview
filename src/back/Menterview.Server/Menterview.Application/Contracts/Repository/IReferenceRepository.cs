using Menterview.Domain.Entities;

namespace Menterview.Application.Contracts.Repository;

public interface IReferenceRepository
{
    Task<bool> CategoryExistsAsync(int categoryId, CancellationToken ct = default);
    Task<bool> DifficultyExistsAsync(int difficultyId, CancellationToken ct = default);
    Task<IEnumerable<Category>> GetCategoriesAsync(CancellationToken ct = default);
    Task<IEnumerable<Difficulty>> GetDifficultiesAsync(CancellationToken ct = default);
    Task<IEnumerable<Tag>> GetTagsAsync(CancellationToken ct = default);
}
