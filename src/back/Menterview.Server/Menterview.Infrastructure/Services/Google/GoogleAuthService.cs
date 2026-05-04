using Google.Apis.Auth;
using Menterview.Application.Contracts.Auth;
using Menterview.Application.Dtos.Auth;
using Menterview.Application.Models.Auth;
using Microsoft.Extensions.Configuration;

namespace Menterview.Infrastructure.Services.Google;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly string _clientId;

    public GoogleAuthService(IConfiguration config)
    {
        _clientId = config["Google:ClientId"] 
                    ?? throw new InvalidOperationException("Google:ClientId not configured");
    }

    public async Task<GoogleUserInfo?> ValidateIdTokenAsync(string idToken, CancellationToken ct = default)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [_clientId]
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            return new GoogleUserInfo
            {
                Sub       = payload.Subject,
                Email     = payload.Email,
                FirstName = payload.GivenName,
                LastName  = payload.FamilyName
            };
        }
        catch (InvalidJwtException)
        {
            return null;
        }
    }
}