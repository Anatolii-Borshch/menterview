namespace Menterview.Domain.Entities
{
    public class Setting
    {
        public int ThemeId { get; set; }
        public Theme Theme { get; set; } = null!;
        
        public int LanguageId { get; set; }
        public Language Language { get; set; } = null!;
        
        public int CountryId { get; set; }
        public Country Country { get; set; } = null!;

        public long UserId { get; set; }
        public User User { get; set; } = null!;
    }
}