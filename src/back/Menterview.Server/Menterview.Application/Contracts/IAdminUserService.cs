using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Admin;

namespace Menterview.Application.Contracts;

public interface IAdminUserService
{
    Task<PagedResult<AdminUserListItemDto>> GetUsersAsync(
        int page, int pageSize, string? searchTerm, int? roleId, CancellationToken ct = default);

    Task<AdminUserDetailsDto> GetUserDetailsAsync(Guid userId, CancellationToken ct = default);

    Task AssignRoleAsync(Guid userId, int roleId, CancellationToken ct = default);

    Task SoftDeleteUserAsync(Guid userId, CancellationToken ct = default);

    Task HardDeleteUserAsync(Guid userId, CancellationToken ct = default);
}
