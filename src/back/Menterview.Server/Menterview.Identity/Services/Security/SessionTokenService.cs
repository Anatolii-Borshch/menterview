using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Menterview.Application.Contracts.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Menterview.Identity.Services.Security;

public class SessionTokenService : ISessionTokenService
{
    private readonly IConfiguration _configuration;

    public SessionTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateSessionToken(long sessionId, DateTime expiresAt)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.Role, "AiWorker"),
            new("session_id", sessionId.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            jwtSettings["Issuer"],
            jwtSettings["Audience"],
            claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
