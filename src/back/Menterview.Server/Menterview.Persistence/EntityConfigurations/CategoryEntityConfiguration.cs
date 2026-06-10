using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class CategoryEntityConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasKey(x => x.CategoryId);
            
            builder.Property(x => x.CategoryName)
                .HasMaxLength(50)
                .IsRequired();
        }
    }
}