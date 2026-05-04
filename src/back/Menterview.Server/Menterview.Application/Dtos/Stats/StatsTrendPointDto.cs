namespace Menterview.Application.Dtos.Stats;

public class StatsTrendPointDto
{
    // Date label for the data point (day/week/month depending on granularity)
    public DateTime Date { get; set; }
    public int Count { get; set; }
    public double? AverageValue { get; set; }
}