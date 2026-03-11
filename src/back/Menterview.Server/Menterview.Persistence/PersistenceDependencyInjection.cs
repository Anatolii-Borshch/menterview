using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Menterview.Persistence
{
    public static class PersistenceDependencyInjection
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
        {
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