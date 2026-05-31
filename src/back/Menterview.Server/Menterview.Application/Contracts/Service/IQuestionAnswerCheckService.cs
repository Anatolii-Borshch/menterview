using Menterview.Application.Dtos.Question;

namespace Menterview.Application.Contracts.Service;

public interface IQuestionAnswerCheckService
{
    Task<AnswerCheckResultDto> CheckAsync(string questionText, string expectedAnswer, string userAnswer, CancellationToken ct = default);
}
