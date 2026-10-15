namespace Bonix.Dominio;

public sealed class CampanhaPromocional
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public Guid TenantId { get; }
    public string Nome { get; private set; } = string.Empty;

    public CampanhaPromocional(Guid tenantId, string nome)
    {
        if (tenantId == Guid.Empty)
        {
            throw new ArgumentException("A campanha deve pertencer a um tenant.", nameof(tenantId));
        }

        TenantId = tenantId;
        Renomear(nome);
    }

    public void Renomear(string nome)
    {
        if (string.IsNullOrWhiteSpace(nome) || nome.Trim().Length > 120)
        {
            throw new ArgumentException("O nome deve conter entre 1 e 120 caracteres.", nameof(nome));
        }

        Nome = nome.Trim();
    }
}
