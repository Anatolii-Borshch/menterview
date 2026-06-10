namespace Menterview.Application.Dtos.Sub;

public class DifficultyAccuracyDto
{
    public DifficultyDto Difficulty { get; set; } = null!;
    public double AverageAccuracy { get; set; }
    public int TotalAnswers { get; set; }
}