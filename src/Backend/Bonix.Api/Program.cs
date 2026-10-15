using Bonix.Api.Tenancy;
using Bonix.Aplicacao.Tenancy;
using Bonix.Contratos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<TenantContext>();
builder.Services.AddScoped<ITenantContext>(services => services.GetRequiredService<TenantContext>());
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseMiddleware<TenantMiddleware>();
app.MapHealthChecks("/health");
app.MapGet("/api/v1/contexto", (ITenantContext tenant) =>
    Results.Ok(new TenantResponse(tenant.TenantId?.ToString(), tenant.IsResolved)));

app.Run();

public partial class Program { }
