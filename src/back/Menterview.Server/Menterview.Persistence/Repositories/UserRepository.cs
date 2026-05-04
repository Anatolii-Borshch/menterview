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
            RoleId = 2,
            CreatedAt = DateTime.UtcNow
        };

        _businessDb.Users.Add(businessUser);
        await _businessDb.SaveChangesAsync(ct);

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

        await _businessDb.SaveChangesAsync();
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
            RoleId = business.RoleId,
            Role = business.Role,
            Setting = business.Setting,
            CreatedAt = business.CreatedAt
        };
    }
}