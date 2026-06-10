using Menterview.Application.Models.Security;

namespace Menterview.Application.Contracts.Repository;

public interface IRefreshTokenRepository : IGenericRepository<RefreshToken, long>
{
    Task<RefreshToken?> GetActiveByTokenAsync(string token, CancellationToken ct = default);
    Task SaveAsync(RefreshToken token, CancellationToken ct = default);
}