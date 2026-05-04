using Menterview.Persistence.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Menterview.Persistence.Factories
{
    public class MenterviewDbContextFactory 
        : IDesignTimeDbContextFactory<MenterviewDbContext>
    {
        public MenterviewDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MenterviewDbContext>();
            string connectionString = args[0];
            
            optionsBuilder.UseNpgsql(connectionString);

            return new MenterviewDbContext(optionsBuilder.Options);
        }
    }
}