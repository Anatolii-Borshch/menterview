using Menterview.Api.Models.General;
using Menterview.Api.Models.Question;
using Menterview.Application.Contracts.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Menterview.Api.Controllers;

[ApiController]
[Route("api/questions")]
[AllowAnonymous]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionQueryService _questionQueryService;

    public QuestionsController(IQuestionQueryService questionQueryService)
    {
        _questionQueryService = questionQueryService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<QuestionListItemResponse>>>> GetQuestions(
        [FromQuery] GetQuestionsQuery query,
        CancellationToken ct)
    {
        var searchTerm = string.IsNullOrWhiteSpace(query.Search) ? query.SearchTerm : query.Search;

        var result = await _questionQueryService.GetQuestionsAsync(
            query.Page,
            query.PageSize,
            query.CategoryId,
            query.DifficultyId,
            query.TagIds,
            searchTerm,
            ct);

        return Ok(ApiResponse<PagedResult<QuestionListItemResponse>>.Success(new PagedResult<QuestionListItemResponse>
        {
            Items = result.Items.Select(question => new QuestionListItemResponse
            {
                QuestionId = question.QuestionId,
                Question = question.QuestionText,
                CategoryId = question.Category.CategoryId,
                CategoryName = question.Category.CategoryName,
                DifficultyId = question.Difficulty.DifficultyId,
                DifficultyName = question.Difficulty.DifficultyName,
                Tags = question.Tags
            }),
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        }));
    }

    [HttpGet("{questionId:long}")]
    public async Task<ActionResult<ApiResponse<QuestionDetailsResponse>>> GetQuestion(long questionId, CancellationToken ct)
    {
        var question = await _questionQueryService.GetQuestionAsync(questionId, ct);

        if (question is null)
            return NotFound(ApiResponse<QuestionDetailsResponse>.Failure("Question not found."));

        return Ok(ApiResponse<QuestionDetailsResponse>.Success(new QuestionDetailsResponse
        {
            QuestionId = question.QuestionId,
            Question = question.QuestionText,
            Answer = question.Answer,
            CategoryId = question.Category.CategoryId,
            CategoryName = question.Category.CategoryName,
            DifficultyId = question.Difficulty.DifficultyId,
            DifficultyName = question.Difficulty.DifficultyName,
            Tags = question.Tags
        }));
    }

}