using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class AnswerEntityConfiguration : IEntityTypeConfiguration<Answer>
    {
        public void Configure(EntityTypeBuilder<Answer> builder)
        {
            builder.HasKey(x => x.AnswerId);
            
            builder.HasOne(x => x.Question)
                .WithMany()
                .HasForeignKey(x => x.QuestionId);
            
            builder.HasOne(x => x.Session)
                .WithMany(x => x.Answers)
                .HasForeignKey(x => x.SessionId);
        }
    }
}