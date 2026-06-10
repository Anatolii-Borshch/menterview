using Menterview.Domain.Entities;
using Menterview.Identity.Models;
using Menterview.Persistence.DbContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Menterview.Api;

public static class AdminSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<AppIdentityUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var appDb = services.GetRequiredService<MenterviewDbContext>();
        var config = services.GetRequiredService<IConfiguration>();

        var adminSection = config.GetSection("AdminSeed");
        var email = adminSection["Email"];
        var password = adminSection["Password"];
        var firstName = adminSection["FirstName"] ?? "Admin";
        var lastName = adminSection["LastName"] ?? "User";

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

        foreach (var roleName in new[] { "Administrator", "User", "AiWorker" })
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
        }

        if (await userManager.FindByEmailAsync(email) is not null)
            return;

        var userId = Guid.NewGuid();

        var adminAppRole = await appDb.Roles.FirstOrDefaultAsync(r => r.RoleName == "Administrator");
        if (adminAppRole is null)
        {
            adminAppRole = new Role { RoleName = "Administrator" };
            appDb.Roles.Add(adminAppRole);
            await appDb.SaveChangesAsync();
        }

        var identityUser = new AppIdentityUser
        {
            Id = userId,
            UserName = email,
            Email = email,
            NormalizedEmail = email.ToUpperInvariant(),
            NormalizedUserName = email.ToUpperInvariant(),
            EmailConfirmed = true,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await userManager.CreateAsync(identityUser, password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Admin seed failed: {errors}");
        }

        await userManager.AddToRoleAsync(identityUser, "Administrator");

        var businessUser = new BusinessUser
        {
            UserId = userId,
            FirstName = firstName,
            LasName = lastName,
            CategoryId = 1,
            DifficultyId = 1,
            RoleId = adminAppRole.RoleId,
            CreatedAt = DateTime.UtcNow
        };
        appDb.Users.Add(businessUser);
        await appDb.SaveChangesAsync();
    }
}
