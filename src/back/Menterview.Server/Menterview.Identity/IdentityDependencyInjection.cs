using Menterview.Application.Contracts.Auth;
using Menterview.Application.Contracts.Profile;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Contracts.Security;
using Menterview.Identity.DbContext;
using Menterview.Identity.Models;
using Menterview.Identity.Repositories;
using Menterview.Identity.Services.Auth;
using Menterview.Identity.Services.Profile;
using Menterview.Identity.Services.Security;
using Menterview.Infrastructure.Services.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Menterview.Identity;

public static class IdentityDependencyInjection
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MenterviewIdentityDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException(
                                       "Connection string 'DefaultConnection' not found.");
            options.UseNpgsql(connectionString);
        });

        services.AddIdentity<AppIdentityUser, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.User.AllowedUserNameCharacters = string.Empty;
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedPhoneNumber = false;
                options.Lockout.AllowedForNewUsers = true;
            })
            .AddEntityFrameworkStores<MenterviewIdentityDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ISessionTokenService, SessionTokenService>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();
        services.AddScoped<IProfileValidator, ProfileValidator>();
        services.AddScoped<IProfileService, ProfileService>();

        return services;
    }
}