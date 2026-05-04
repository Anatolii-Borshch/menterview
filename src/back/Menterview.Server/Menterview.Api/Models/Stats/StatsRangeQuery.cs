using Menterview.Domain.Enums;

namespace Menterview.Api.Models.Stats;

public class StatsRangeQuery
{
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public StatsGranularity Granularity { get; set; } = StatsGranularity.Day;
}