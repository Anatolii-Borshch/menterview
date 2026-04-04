using System.Security.Claims;

namespace Menterview.Application.Contracts.Security;

public interface IJwtTokenService
{
    string GenerateAccessToken(Guid userId, string email, IList<string> roles);
    string GenerateRefreshToken();
}