using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Contracts.Service;
using Menterview.Application.Dtos;
using Menterview.Application.Dtos.Admin;
using Menterview.Application.Dtos.Sub;
using Menterview.Identity.Models;
using Menterview.Persistence.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Services;

public class AdminUserService : IAdminUserService
{
    private readonly IUserRepository _userRepo;
    private readonly MenterviewDbContext _businessDb;

    public AdminUserService(
        IUserRepository userRepo,
        MenterviewDbContext businessDb)
    {
        _userRepo = userRepo;
        _businessDb = businessDb;
    }

    public async Task<PagedResult<AdminUserListItemDto>> GetUsersAsync(
        int page, int pageSize, string? searchTerm, int? roleId, CancellationToken ct = default)
    {
        var items = await _userRepo.GetPagedAsync(page, pageSize, searchTerm, roleId, ct);
        var total = await _userRepo.CountAsync(searchTerm, roleId, ct);

        var dtos = items.Select(u => new AdminUserListItemDto
        {
            UserId = u.UserId,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Email = u.EmailAddress,
            RoleName = u.Role?.RoleName ?? string.Empty,
            CategoryName = u.Category?.CategoryName ?? string.Empty,
            CreatedAt = u.CreatedAt,
            IsDeleted = u.IsDeleted
        });

        return new PagedResult<AdminUserListItemDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<AdminUserDetailsDto> GetUserDetailsAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepo.GetByIdOrDefaultAsync(userId, ct)
                   ?? throw new KeyNotFoundException($"User {userId} not found.");

        var sessionCount = await _businessDb.SessionStories
            .CountAsync(s => s.UserId == userId, ct);

        return new AdminUserDetailsDto
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.EmailAddress,
            RoleName = user.Role?.RoleName ?? string.Empty,
            CategoryName = user.Category?.CategoryName ?? string.Empty,
            CreatedAt = user.CreatedAt,
            IsDeleted = user.IsDeleted,
            DeletedAt = user.DeletedAt,
            SessionCount = sessionCount,
            DifficultyName = user.Difficulty?.DifficultyName ?? string.Empty,
            LevelName = user.Level?.LevelName
        };
    }

    public async Task AssignRoleAsync(Guid userId, int roleId, CancellationToken ct = default)
    {
        var role = await _businessDb.Roles.FindAsync(new object[] { roleId }, ct)
                   ?? throw new KeyNotFoundException($"Role {roleId} not found.");

        await _userRepo.UpdateRoleAsync(userId, roleId, role.RoleName, ct);
    }

    public async Task SoftDeleteUserAsync(Guid userId, CancellationToken ct = default)
    {
        await _userRepo.SoftDeleteAsync(userId, ct);
    }

    public async Task HardDeleteUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _userRepo.GetByIdOrDefaultAsync(userId, ct)
                   ?? throw new KeyNotFoundException($"User {userId} not found.");

        if (!user.IsDeleted)
            throw new InvalidOperationException("User must be soft-deleted before permanent deletion.");

        await _userRepo.DeleteAsync(user);
    }
}
