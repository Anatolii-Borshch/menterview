using Menterview.Identity.DbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Menterview.Identity.Factories
{
    public class MenterviewIdentityDbContextFactory
        : IDesignTimeDbContextFactory<MenterviewIdentityDbContext>
    {
        public MenterviewIdentityDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MenterviewIdentityDbContext>();
            string connectionString = args[0];
            
            optionsBuilder.UseNpgsql(connectionString);

            return new MenterviewIdentityDbContext(optionsBuilder.Options);
        }
    }
}