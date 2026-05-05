namespace Menterview.Application.Dtos.Sub;

public class CategoryAccuracyDto
{
    public CategoryDto Category { get; set; } = null!;
    public double AverageAccuracy { get; set; }
    public int TotalAnswers { get; set; }
}