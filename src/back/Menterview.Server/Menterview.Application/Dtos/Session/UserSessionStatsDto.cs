using Menterview.Application.Dtos.Sub;

namespace Menterview.Application.Dtos.Session;

public class UserSessionStatsDto
{
    public IEnumerable<SessionTrendPointDto> Trend { get; set; } = [];
    public double OverallAverageAccuracy { get; set; }
    public double OverallAverageTime { get; set; }
    public int TotalSessionsCount { get; set; }
    public IEnumerable<CategoryAccuracyDto> AccuracyByCategory { get; set; } = [];
    public IEnumerable<DifficultyAccuracyDto> AccuracyByDifficulty { get; set; } = [];
}