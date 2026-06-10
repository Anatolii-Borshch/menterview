namespace Menterview.Application.Dtos.Stats;

public class StatsTrendPointDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
    public double? AverageValue { get; set; }
}