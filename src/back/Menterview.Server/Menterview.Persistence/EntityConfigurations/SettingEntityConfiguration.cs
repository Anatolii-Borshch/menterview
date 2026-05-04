using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Menterview.Persistence.EntityConfigurations
{
    public class SettingEntityConfiguration : IEntityTypeConfiguration<Setting>
    {
        public void Configure(EntityTypeBuilder<Setting> builder)
        {
            builder.HasKey(x => x.UserId);
            
            builder.HasOne(x => x.BusinessUser)
                .WithOne(x => x.Setting)
                .HasForeignKey<Setting>(x => x.UserId);

            builder.HasOne(x => x.Theme)
                .WithMany()
                .HasForeignKey(x => x.ThemeId);
            
            builder.HasOne(x => x.Country)
                .WithMany()
                .HasForeignKey(x => x.CountryId);
            
            builder.HasOne(x => x.Language)
                .WithMany()
                .HasForeignKey(x => x.LanguageId);
        }
    }
}