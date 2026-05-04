using Menterview.Application.Models.Application;
using Menterview.Domain.Entities;

namespace Menterview.Application.Contracts.Repository;

public interface IUserRepository : IGenericRepository<User, Guid>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User> CreateAsync(CreateUserRequest request, CancellationToken ct = default);
}