using Menterview.Api.Models.General;
using Menterview.Api.Models.Question;
using Menterview.Application.Contracts.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/questions")]
[Authorize]
public class QuestionEnhancementsController : ControllerBase
{
    private readonly IQuestionQueryService _questionQueryService;
    private readonly IQuestionRephraseService _questionRephraseService;
    private readonly IQuestionAnswerCheckService _questionAnswerCheckService;

    public QuestionEnhancementsController(IQuestionQueryService questionQueryService,
        IQuestionRephraseService questionRephraseService,
        IQuestionAnswerCheckService questionAnswerCheckService)
    {
        _questionQueryService = questionQueryService;
        _questionRephraseService = questionRephraseService;
        _questionAnswerCheckService = questionAnswerCheckService;
    }

    [HttpPost("{questionId:long}/rephrase")]
    public async Task<ActionResult<ApiResponse<RephraseQuestionResponse>>> RephraseQuestion(long questionId, CancellationToken ct)
    {
        var question = await _questionQueryService.GetQuestionAsync(questionId, ct);
        if (question is null)
            return NotFound(ApiResponse<RephraseQuestionResponse>.Failure("Question not found."));

        var rephrased = await _questionRephraseService.RephraseAsync(question.QuestionText, ct);

        return Ok(ApiResponse<RephraseQuestionResponse>.Success(new RephraseQuestionResponse
        {
            Rephrased = rephrased
        }));
    }

    [HttpPost("{questionId:long}/check-answer")]
    public async Task<ActionResult<ApiResponse<CheckAnswerResponse>>> CheckAnswer(long questionId, [FromBody] CheckAnswerRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.AnswerText))
            return BadRequest(ApiResponse<CheckAnswerResponse>.Failure("Answer text is required."));

        var question = await _questionQueryService.GetQuestionAsync(questionId, ct);
        if (question is null)
            return NotFound(ApiResponse<CheckAnswerResponse>.Failure("Question not found."));

        var score = await _questionAnswerCheckService.CheckAsync(
            question.QuestionText,
            question.Answer,
            request.AnswerText,
            ct);

        return Ok(ApiResponse<CheckAnswerResponse>.Success(new CheckAnswerResponse
        {
            Accuracy = score.Accuracy,
            Correctness = score.Correctness,
            Completeness = score.Completeness,
            AiReply = score.AiReply
        }));
    }
}
