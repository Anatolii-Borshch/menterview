using System.Net;
using System.Text.Json;
using Menterview.Api.Models;
using Menterview.Api.Models.General;
using Menterview.Application.Contracts.Loggining;

namespace Menterview.Api.Middleware;

public class ExceptionMiddleware
{
    private readonly IAppLogger<ExceptionMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next, IAppLogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError("Unhandled exception on {Method} {Path} — {Message}",
                context.Request.Method,
                context.Request.Path,
                ex.Message);

            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, errors) = exception switch
        {
            UnauthorizedAccessException e => (HttpStatusCode.Unauthorized, new[] { e.Message }),
            InvalidOperationException e => (HttpStatusCode.BadRequest, new[] { e.Message }),
            KeyNotFoundException e => (HttpStatusCode.NotFound, new[] { e.Message }),
            ArgumentException e => (HttpStatusCode.UnprocessableEntity, new[] { e.Message }),
            _ => (HttpStatusCode.InternalServerError, new[] { "An unexpected error occurred." })
        };

        var response = ApiResponse.Failure(errors);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}