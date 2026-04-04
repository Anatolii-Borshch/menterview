using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class UserEntityConfiguration : IEntityTypeConfiguration<BusinessUser>
    {
        public void Configure(EntityTypeBuilder<BusinessUser> builder)
        {
            builder.Property(x => x.UserId).IsRequired();
            builder.HasKey(x => x.UserId);
            
            builder.HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId);
            
            builder.HasOne(x => x.Role)
                .WithMany()
                .HasForeignKey(x => x.RoleId);

            builder.HasOne(x => x.Setting)
                .WithOne(x => x.BusinessUser);

            builder.Property(x => x.LasName).IsRequired();
            builder.Property(x => x.FirstName).IsRequired();
        }
    }
}