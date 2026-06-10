using Menterview.Application.Models.Security;
using Menterview.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Identity.DbContext;

public class MenterviewIdentityDbContext : IdentityDbContext<AppIdentityUser, IdentityRole<Guid>, Guid>
{
    public MenterviewIdentityDbContext(DbContextOptions<MenterviewIdentityDbContext> options)
        : base(options)
    {
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema("identity");

        base.OnModelCreating(builder);

        builder.Entity<AppIdentityUser>(entity => { entity.Property(e => e.Id).ValueGeneratedNever(); });

        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(rt => rt.Id);

            entity.Property(rt => rt.Token)
                .IsRequired()
                .HasMaxLength(512);

            entity.Property(rt => rt.IdentityUserId)
                .IsRequired()
                .HasMaxLength(36);

            entity.HasIndex(rt => rt.Token).IsUnique();
            entity.HasIndex(rt => rt.IdentityUserId);
        });

        builder.Entity<IdentityRole<Guid>>().HasData(
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                Name = "Administrator",
                NormalizedName = "ADMINISTRATOR",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new IdentityRole<Guid>
            {
                Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                Name = "User",
                NormalizedName = "USER",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            }
        );
    }
}