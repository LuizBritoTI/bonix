using Bonix.Aplicacao.Tenancy;

namespace Bonix.Api.Tenancy;

public sealed class TenantMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, TenantContext tenant)
    {
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var header))
        {
            if (!Guid.TryParse(header, out var tenantId) || tenantId == Guid.Empty)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                await context.Response.WriteAsJsonAsync(new { erro = "X-Tenant-Id deve ser um GUID válido." });
                return;
            }

            tenant.SetTenant(tenantId);
        }

        await next(context);
    }
}
