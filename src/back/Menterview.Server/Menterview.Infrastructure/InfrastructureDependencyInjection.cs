using Manager;
using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Auth;
using Menterview.Application.Contracts.Client;
using Menterview.Application.Contracts.Email;
using Menterview.Application.Models.Application;
using Menterview.Application.Models.Email;
using Menterview.Infrastructure.Services;
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
        services.Configure<FrontendSettings>(configuration.GetSection("Frontend"));
        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));
        services.AddScoped<IEmailService, EmailService>();

        var workerManagerAddress = configuration["WorkerManager:Address"] ?? "http://worker-manager:6000";
        services.AddGrpcClient<ManagerService.ManagerServiceClient>(o =>
        {
            o.Address = new Uri(workerManagerAddress);
        });
        services.AddScoped<IWorkerManagerClient, WorkerManagerClient>();
        
        return services;
    }
}