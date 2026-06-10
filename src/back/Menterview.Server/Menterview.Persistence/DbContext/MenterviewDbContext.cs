using Menterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Persistence.DbContext
{
    public class MenterviewDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public MenterviewDbContext(DbContextOptions<MenterviewDbContext> options) : base(options)
        {
        }
        
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Difficulty> Difficulties { get; set; }
        public DbSet<NewQuestion> NewQuestions { get; set; }
        public DbSet<NewQuestionTag> NewQuestionTags { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuestionTag> QuestionTags { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<BusinessUser> Users { get; set; }
        public DbSet<SessionStory> SessionStories { get; set; }
        public DbSet<SessionFollowUpQuestion> SessionFollowUpQuestions { get; set; }
        public DbSet<WeakTopic> WeakTopics { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Theme> Themes { get; set; }
        public DbSet<Language> Languages { get; set; }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasDefaultSchema("buisness");
            
            base.OnModelCreating(builder);
            
            builder.ApplyConfigurationsFromAssembly(typeof(MenterviewDbContext).Assembly);
            
            builder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "Java" },
                new Category { CategoryId = 2, CategoryName = ".NET" }
            );

            builder.Entity<Level>().HasData(
                new Level { LevelId = 1, LevelName = "Junior" },
                new Level { LevelId = 2, LevelName = "Mid" },
                new Level { LevelId = 3, LevelName = "Senior" }
            );

            builder.Entity<Difficulty>().HasData(
                new Difficulty { DifficultyId = 1, DifficultyName = "Easy" },
                new Difficulty { DifficultyId = 2, DifficultyName = "Medium" },
                new Difficulty { DifficultyId = 3, DifficultyName = "Hard" }
            );

            builder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Administrator" },
                new Role { RoleId = 2, RoleName = "User" }
            );
        }
    }
}