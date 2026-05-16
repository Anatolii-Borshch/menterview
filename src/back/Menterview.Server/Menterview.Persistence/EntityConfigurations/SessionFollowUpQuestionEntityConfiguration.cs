using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations;

public class SessionFollowUpQuestionEntityConfiguration : IEntityTypeConfiguration<SessionFollowUpQuestion>
{
    public void Configure(EntityTypeBuilder<SessionFollowUpQuestion> builder)
    {
        builder.HasKey(x => x.FollowUpQuestionId);

        builder.HasOne(x => x.Session)
            .WithMany(x => x.FollowUpQuestions)
            .HasForeignKey(x => x.SessionId);

        builder.HasOne(x => x.Category)
            .WithMany()
            .HasForeignKey(x => x.CategoryId);

        builder.HasOne(x => x.Difficulty)
            .WithMany()
            .HasForeignKey(x => x.DifficultyId);
    }
}
