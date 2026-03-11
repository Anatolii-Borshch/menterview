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
            
            builder.HasOne(x => x.User)
                .WithMany(x => x.Sessions)
                .HasForeignKey(x => x.UserId);
        }
    }
}