using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Identity.DbContext
{
    public class MenterviewIdentityDbContext : IdentityDbContext
    {
        public MenterviewIdentityDbContext(DbContextOptions<MenterviewIdentityDbContext> options) 
            : base(options)
        {
        }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasDefaultSchema("identity");
            
            base.OnModelCreating(builder);

            builder.Entity<IdentityUser>(entity =>
            {
                entity.Ignore(u => u.PhoneNumber);
                entity.Ignore(u => u.PhoneNumberConfirmed);
                entity.Ignore(u => u.TwoFactorEnabled);
                entity.Ignore(u => u.UserName);
                entity.Ignore(u => u.NormalizedUserName);
            });
        }
    }
}