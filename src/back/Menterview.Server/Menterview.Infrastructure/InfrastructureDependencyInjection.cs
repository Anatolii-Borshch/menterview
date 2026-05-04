using Menterview.Application.Contracts.Auth;
using Menterview.Application.Contracts.Email;
using Menterview.Application.Models.Email;
using Menterview.Infrastructure.Services.Email;
using Menterview.Infrastructure.Services.Google;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Menterview.Infrastructure;

public static class InfrastructureDependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpClient<IGoogleAuthService, GoogleAuthService>();
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        services.AddScoped<IEmailService, EmailService>();
        
        return services;
    }
}