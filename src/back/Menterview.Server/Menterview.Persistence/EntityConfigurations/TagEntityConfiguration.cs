using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class TagEntityConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.HasKey(x => x.TagId);

            builder.Property(x => x.TagName)
                .IsRequired()
                .HasMaxLength(50);
        }
    }
}