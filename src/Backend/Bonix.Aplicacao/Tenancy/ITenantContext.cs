namespace Bonix.Aplicacao.Tenancy;

public interface ITenantContext
{
    Guid? TenantId { get; }
    bool IsResolved { get; }
}

public sealed class TenantContext : ITenantContext
{
    public Guid? TenantId { get; private set; }
    public bool IsResolved => TenantId.HasValue;

    public void SetTenant(Guid tenantId)
    {
        if (tenantId == Guid.Empty)
        {
            throw new ArgumentException("O identificador do tenant não pode ser vazio.", nameof(tenantId));
        }

        TenantId = tenantId;
    }
}
