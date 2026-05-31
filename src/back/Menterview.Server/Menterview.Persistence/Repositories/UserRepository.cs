using Menterview.Application.Contracts.Repository;
using Menterview.Application.Models.Application;
using Menterview.Domain.Entities;
using Menterview.Identity.DbContext;
using Menterview.Identity.Models;
using Menterview.Persistence.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MenterviewDbContext _businessDb;
    private readonly MenterviewIdentityDbContext _identityDb;
    private readonly UserManager<AppIdentityUser> _userManager;

    public UserRepository(
        UserManager<AppIdentityUser> userManager,
        MenterviewIdentityDbContext identityDb,
        MenterviewDbContext businessDb)
    {
        _userManager = userManager;
        _identityDb = identityDb;
        _businessDb = businessDb;
    }
    
    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        var identityUser = await _userManager.FindByEmailAsync(email);
        if (identityUser is null) return null;

        return await AggregateAsync(identityUser, ct);
    }

    public async Task<User> GetByIdAsync(Guid id)
    {
        var identityUser = await _userManager.FindByIdAsync(id.ToString())
                           ?? throw new KeyNotFoundException($"Identity user {id} not found");

        return await AggregateAsync(identityUser)
               ?? throw new KeyNotFoundException($"Business user {id} not found");
    }
    
    public async Task<User> CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        var identityUser = new AppIdentityUser
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            UserName = request.Email,
            NormalizedEmail = request.Email.ToUpperInvariant(),
            EmailConfirmed = request.ExternalProvider is not null,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = request.Password is not null
            ? await _userManager.CreateAsync(identityUser, request.Password)
            : await _userManager.CreateAsync(identityUser);

        if (!result.Succeeded)
            throw new InvalidOperationException(
                string.Join("; ", result.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(identityUser, "User");

        var businessUser = new BusinessUser
        {
            UserId = identityUser.Id,
            FirstName = request.FirstName,
            LasName = request.LastName,
            CategoryId = request.CategoryId,
            LevelId = request.LevelId,
            DifficultyId = 1,
            RoleId = 2,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _businessDb.Users.Add(businessUser);
            await _businessDb.SaveChangesAsync(ct);
        }
        catch
        {
            await _userManager.DeleteAsync(identityUser);
            throw;
        }

        return MapToApplicationUser(identityUser, businessUser);
    }
    
    public async Task<IReadOnlyCollection<User>> GetAllAsync()
    {
        var identityUsers = _userManager.Users.ToList();
        var businessUsers = await _businessDb.Users
            .Include(u => u.Category)
            .Include(u => u.Role)
            .ToListAsync();

        var businessById = businessUsers.ToDictionary(u => u.UserId);

        return identityUsers
            .Where(i => businessById.ContainsKey(i.Id))
            .Select(i => MapToApplicationUser(i, businessById[i.Id]))
            .ToList()
            .AsReadOnly();
    }

    public async Task<User?> GetByIdOrDefaultAsync(Guid id, CancellationToken ct = default)
    {
        var identityUser = await _userManager.FindByIdAsync(id.ToString());
        if (identityUser is null) return null;
        return await AggregateAsync(identityUser, ct);
    }

    public async Task<IReadOnlyCollection<User>> GetPagedAsync(
        int page, int pageSize, string? searchTerm, int? roleId, CancellationToken ct = default)
    {
        var businessQuery = _businessDb.Users
            .Include(u => u.Category)
            .Include(u => u.Role)
            .Include(u => u.Difficulty)
            .Include(u => u.Setting)
            .AsNoTracking();

        if (roleId.HasValue)
            businessQuery = businessQuery.Where(u => u.RoleId == roleId.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lower = searchTerm.ToLower();
            businessQuery = businessQuery.Where(u =>
                u.FirstName.ToLower().Contains(lower) ||
                u.LasName.ToLower().Contains(lower));
        }

        var businessUsers = await businessQuery
            .OrderBy(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var ids = businessUsers.Select(u => u.UserId.ToString()).ToHashSet();
        var identityUsers = _userManager.Users
            .Where(i => ids.Contains(i.Id.ToString()))
            .ToList();
        var identityById = identityUsers.ToDictionary(i => i.Id);

        return businessUsers
            .Where(b => identityById.ContainsKey(b.UserId))
            .Select(b => MapToApplicationUser(identityById[b.UserId], b))
            .ToList()
            .AsReadOnly();
    }

    public async Task<int> CountAsync(string? searchTerm, int? roleId, CancellationToken ct = default)
    {
        var query = _businessDb.Users.AsNoTracking();

        if (roleId.HasValue)
            query = query.Where(u => u.RoleId == roleId.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var lower = searchTerm.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(lower) ||
                u.LasName.ToLower().Contains(lower));
        }

        return await query.CountAsync(ct);
    }

    public async Task UpdateRoleAsync(Guid userId, int roleId, string roleName, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users.FindAsync(new object[] { userId }, ct)
                           ?? throw new KeyNotFoundException($"Business user {userId} not found");

        var identityUser = await _userManager.FindByIdAsync(userId.ToString())
                           ?? throw new KeyNotFoundException($"Identity user {userId} not found");

        var currentRoles = await _userManager.GetRolesAsync(identityUser);
        await _userManager.RemoveFromRolesAsync(identityUser, currentRoles);
        await _userManager.AddToRoleAsync(identityUser, roleName);

        businessUser.RoleId = roleId;
        await _businessDb.SaveChangesAsync(ct);
    }

    public async Task AddAsync(User entity)
    {
        throw new NotSupportedException("Use CreateAsync(CreateUserRequest) instead.");
    }

    public async Task UpdateAsync(User entity)
    {
        var businessUser = await _businessDb.Users.FindAsync(entity.UserId)
                           ?? throw new KeyNotFoundException($"Business user {entity.UserId} not found");

        businessUser.FirstName = entity.FirstName;
        businessUser.LasName = entity.LastName;
        businessUser.CategoryId = entity.CategoryId;
        businessUser.DifficultyId = entity.DifficultyId;

        await _businessDb.SaveChangesAsync();
    }

    public async Task UpdateProfileAsync(Guid userId, string firstName, string lastName, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users.FindAsync(new object[] { userId }, ct)
                           ?? throw new KeyNotFoundException($"Business user {userId} not found");

        businessUser.FirstName = firstName;
        businessUser.LasName = lastName;

        await _businessDb.SaveChangesAsync(ct);
    }

    public async Task UpdateCategoryAsync(Guid userId, int categoryId, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users.FindAsync(new object[] { userId }, ct)
                           ?? throw new KeyNotFoundException($"Business user {userId} not found");

        businessUser.CategoryId = categoryId;

        await _businessDb.SaveChangesAsync(ct);
    }

    public async Task UpdateDifficultyAsync(Guid userId, int difficultyId, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users.FindAsync(new object[] { userId }, ct)
                           ?? throw new KeyNotFoundException($"Business user {userId} not found");

        businessUser.DifficultyId = difficultyId;

        await _businessDb.SaveChangesAsync(ct);
    }

    public async Task UpdateLevelAsync(Guid userId, int levelId, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users.FindAsync(new object[] { userId }, ct)
                           ?? throw new KeyNotFoundException($"Business user {userId} not found");

        businessUser.LevelId = levelId;

        await _businessDb.SaveChangesAsync(ct);
    }

    public async Task SoftDeleteAsync(Guid userId, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users.FindAsync(new object[] { userId }, ct)
                           ?? throw new KeyNotFoundException($"Business user {userId} not found");

        if (businessUser.IsDeleted)
            return;

        businessUser.IsDeleted = true;
        businessUser.DeletedAt = DateTime.UtcNow;

        await _businessDb.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(User entity)
    {
        var identityUser = await _userManager.FindByIdAsync(entity.UserId.ToString())
                           ?? throw new KeyNotFoundException();

        await _userManager.DeleteAsync(identityUser);

        var businessUser = await _businessDb.Users.FindAsync(entity.UserId);
        if (businessUser is not null)
        {
            _businessDb.Users.Remove(businessUser);
            await _businessDb.SaveChangesAsync();
        }
    }
    
    private async Task<User?> AggregateAsync(AppIdentityUser identityUser, CancellationToken ct = default)
    {
        var businessUser = await _businessDb.Users
            .Include(u => u.Category)
            .Include(u => u.Difficulty)
            .Include(u => u.Level)
            .Include(u => u.Role)
            .Include(u => u.Setting)
            .FirstOrDefaultAsync(u => u.UserId == identityUser.Id, ct);

        return businessUser is null ? null : MapToApplicationUser(identityUser, businessUser);
    }

    private static User MapToApplicationUser(AppIdentityUser identity, BusinessUser business)
    {
        return new User
        {
            UserId = identity.Id,
            EmailAddress = identity.Email!,
            FirstName = business.FirstName,
            LastName = business.LasName,
            CategoryId = business.CategoryId,
            Category = business.Category,
            DifficultyId = business.DifficultyId,
            Difficulty = business.Difficulty,
            LevelId = business.LevelId,
            Level = business.Level,
            RoleId = business.RoleId,
            Role = business.Role,
            Setting = business.Setting,
            CreatedAt = business.CreatedAt,
            IsDeleted = business.IsDeleted,
            DeletedAt = business.IsDeleted ? business.DeletedAt : null
        };
    }
}