using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class QuestionTagEntityConfiguration : IEntityTypeConfiguration<QuestionTag>
    {
        public void Configure(EntityTypeBuilder<QuestionTag> builder)
        {
            builder.HasKey(x => x.QuestionTagId);
            
            builder.HasOne(x => x.Question)
                .WithMany(x => x.QuestionTags)
                .HasForeignKey(x => x.QuestionId);
            
            builder.HasOne(x => x.Tag)
                .WithMany()
                .HasForeignKey(x => x.TagId);
        }
    }
}