
using Menterview.Application.Dtos.Sub;

namespace Menterview.Api.Models.User;

public class UserSettingsDto
{
    public ThemeDto Theme { get; set; } = null!;
    public LanguageDto Language { get; set; } = null!;
    public CountryDto Country { get; set; } = null!;
}