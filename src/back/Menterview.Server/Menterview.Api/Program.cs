using Menterview.Api.Middleware;
using Menterview.Application;
using Menterview.Identity;
using Menterview.Infrastructure;
using Menterview.Persistence;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddControllers();
builder.Services.AddAuthorization();

builder.Services.AddInfrastructureServices(configuration);
builder.Services.AddPersistenceServices(configuration);
builder.Services.AddIdentityServices(configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddApplicationServices();

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapControllers();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.Run();
