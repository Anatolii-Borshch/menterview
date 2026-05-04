using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class ThemeEntityConfiguration : IEntityTypeConfiguration<Theme>
    {
        public void Configure(EntityTypeBuilder<Theme> builder)
        {
            builder.HasKey(x => x.ThemeId);
            
            builder.Property(x => x.ThemeName)
                .IsRequired()
                .HasMaxLength(50);
        }
    }
}