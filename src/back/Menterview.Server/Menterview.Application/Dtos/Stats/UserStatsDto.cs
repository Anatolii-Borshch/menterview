
namespace Menterview.Application.Dtos.Stats;

public class UserStatsDto
{
    public int TotalUsers { get; set; }
    public int DeletedUsers { get; set; }
    public IEnumerable<StatsTrendPointDto> RegistrationTrend { get; set; } = [];
}