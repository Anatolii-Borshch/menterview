using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class CountryEntityConfiguration : IEntityTypeConfiguration<Country>
    {
        public void Configure(EntityTypeBuilder<Country> builder)
        {
            builder.HasKey(x => x.CountryId);
            
            builder.Property(x => x.CountryId)
                .IsRequired()
                .HasMaxLength(50);
        }
    }
}