using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Menterview.Persistence.Factories
{
    public class MenterviewDbContextFactory 
        : IDesignTimeDbContextFactory<MenterviewDbContext>
    {
        public MenterviewDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "Connection string 'DefaultConnection' not found. " +
                    "Set it in appsettings.Development.json or via ConnectionStrings__DefaultConnection env var.");

            var optionsBuilder = new DbContextOptionsBuilder<MenterviewDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new MenterviewDbContext(optionsBuilder.Options);
        }
    }
}