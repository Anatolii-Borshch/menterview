using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations;

public class WeakTopicEntityConfiguration : IEntityTypeConfiguration<WeakTopic>
{
    public void Configure(EntityTypeBuilder<WeakTopic> builder)
    {
        builder.HasKey(x => x.WeakTopicId);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId);

        builder.HasOne(x => x.Tag)
            .WithMany()
            .HasForeignKey(x => x.TagId);

        builder.HasOne(x => x.Category)
            .WithMany()
            .HasForeignKey(x => x.CategoryId);

        builder.HasOne(x => x.Difficulty)
            .WithMany()
            .HasForeignKey(x => x.DifficultyId);

        builder.HasOne(x => x.OriginalQuestion)
            .WithMany()
            .HasForeignKey(x => x.OriginalQuestionId);
    }
}