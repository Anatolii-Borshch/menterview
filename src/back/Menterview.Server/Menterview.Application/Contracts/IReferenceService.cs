using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Contracts;

public interface IReferenceService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken ct = default);
    Task<IEnumerable<DifficultyDto>> GetDifficultiesAsync(CancellationToken ct = default);
    Task<IEnumerable<TagDto>> GetTagsAsync(CancellationToken ct = default);
}
