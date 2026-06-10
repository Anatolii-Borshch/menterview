namespace Menterview.Application.Contracts.Service;

public interface IQuestionRephraseService
{
    Task<string> RephraseAsync(string questionText, CancellationToken ct = default);
}
