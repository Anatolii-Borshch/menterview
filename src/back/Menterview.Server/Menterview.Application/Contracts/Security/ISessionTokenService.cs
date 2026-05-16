namespace Menterview.Application.Contracts.Security;

public interface ISessionTokenService
{
    string GenerateSessionToken(long sessionId, DateTime expiresAt);
}
