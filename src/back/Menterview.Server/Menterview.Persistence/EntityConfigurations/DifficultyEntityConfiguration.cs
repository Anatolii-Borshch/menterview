using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class DifficultyEntityConfiguration : IEntityTypeConfiguration<Difficulty>
    {
        public void Configure(EntityTypeBuilder<Difficulty> builder)
        {
            builder.HasKey(x => x.DifficultyId);
            
            builder.Property(x => x.DifficultyName)
                .HasMaxLength(50)
                .IsRequired();
        }
    }
}