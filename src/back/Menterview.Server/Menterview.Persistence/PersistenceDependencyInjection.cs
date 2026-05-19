using Menterview.Application.Contracts;
using Menterview.Application.Contracts.Repository;
using Menterview.Application.Contracts.Service;
using Menterview.Persistence.DbContext;
using Menterview.Persistence.Repositories;
using Menterview.Persistence.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Menterview.Persistence
{
    public static class PersistenceDependencyInjection
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IReferenceRepository, ReferenceRepository>();
            services.AddScoped<ISessionRepository, SessionRepository>();
            services.AddScoped<IAdminUserService, AdminUserService>();
            services.AddScoped<IQuestionModerationService, QuestionModerationService>();
            services.AddScoped<IQuestionQueryService, QuestionQueryService>();
            services.AddScoped<ISessionService, SessionService>();
            services.AddScoped<IQuestionSelectionService, QuestionSelectionService>();
            services.AddScoped<ISessionOrchestrationService, SessionOrchestrationService>();
            services.AddScoped<IWeakTopicService, WeakTopicService>();
            services.AddScoped<IAdminStatsService, AdminStatsService>();
            services.AddScoped<IAdminReferenceService, AdminReferenceService>();

            services.AddDbContext<MenterviewDbContext>(options =>
            {
                string connectionString = configuration.GetConnectionString("DefaultConnection") 
                                          ?? throw new InvalidOperationException();
                options.UseNpgsql(connectionString);
            });
            
            return services;
        }
    }
}