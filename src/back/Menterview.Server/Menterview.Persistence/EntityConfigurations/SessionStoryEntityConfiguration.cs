using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class SessionStoryEntityConfiguration : IEntityTypeConfiguration<SessionStory>
    {
        public void Configure(EntityTypeBuilder<SessionStory> builder)
        {
            builder.HasKey(x => x.SessionId);
            
            builder.HasOne(x => x.BusinessUser)
                .WithMany(x => x.Sessions)
                .HasForeignKey(x => x.UserId);

            builder.HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId);

            builder.HasOne(x => x.Difficulty)
                .WithMany()
                .HasForeignKey(x => x.DifficultyId);
        }
    }
}