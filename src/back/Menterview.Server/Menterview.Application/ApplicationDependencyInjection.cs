using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Loggining;
using Menterview.Application.Implementations;
using Menterview.Application.Implementations.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace Menterview.Application;

public static class ApplicationDependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddSingleton(typeof(IAppLogger<>), typeof(AppLogger<>));
        services.AddScoped<IReferenceService, ReferenceService>();

        return services;
    }
}