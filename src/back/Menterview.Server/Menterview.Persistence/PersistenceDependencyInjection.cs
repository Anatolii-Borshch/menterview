using Menterview.Application.Contracts.Repository;
using Menterview.Persistence.DbContext;
using Menterview.Persistence.Repositories;
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