using Menterview.Application.Models.Application;

namespace Menterview.Application.Contracts.Repository;

public interface IUserRepository : IGenericRepository<User, Guid>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByIdOrDefaultAsync(Guid id, CancellationToken ct = default);
    Task<User> CreateAsync(CreateUserRequest request, CancellationToken ct = default);
    Task UpdateProfileAsync(Guid userId, string firstName, string lastName, CancellationToken ct = default);
    Task UpdateCategoryAsync(Guid userId, int categoryId, CancellationToken ct = default);
    Task UpdateDifficultyAsync(Guid userId, int difficultyId, CancellationToken ct = default);
    Task UpdateLevelAsync(Guid userId, int levelId, CancellationToken ct = default);
    Task UpdateSkillTagsAsync(Guid userId, IReadOnlyList<int> tagIds, CancellationToken ct = default);
    Task UpdateRoleAsync(Guid userId, int roleId, string roleName, CancellationToken ct = default);
    Task SoftDeleteAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyCollection<User>> GetPagedAsync(int page, int pageSize, string? searchTerm, int? roleId, CancellationToken ct = default);
    Task<int> CountAsync(string? searchTerm, int? roleId, CancellationToken ct = default);
}
