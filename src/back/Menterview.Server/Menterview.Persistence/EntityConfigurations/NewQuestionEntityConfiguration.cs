using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class NewQuestionEntityConfiguration : IEntityTypeConfiguration<NewQuestion>
    {
        public void Configure(EntityTypeBuilder<NewQuestion> builder)
        {
            builder.HasKey(x => x.SuggestionId);
            
            builder.HasOne(x => x.User)
                .WithMany(x => x.SuggestedQuestions)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}