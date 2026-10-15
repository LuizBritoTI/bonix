# Bonix · Vai de Bônus

Plataforma SaaS multi-tenant de cashback, fidelização, bônus e campanhas promocionais para redes varejistas. **Bonix** é a plataforma; **Vai de Bônus** é a marca voltada ao consumidor.

O repositório é um monorepo com uma demonstração navegável do administrativo e a estrutura inicial modular do backend ASP.NET Core. A demonstração funciona sem API ou serviços externos e usa dados fictícios.

## Requisitos

- Node.js 22.12 ou superior e npm
- .NET SDK 10

## Desenvolvimento

Na raiz do repositório:

```bash
./scripts/install.sh
npm run dev
```

Abra o endereço local mostrado pelo Vite. Use o acesso demonstrativo como administradora ou marketing; os dados e a sessão ficam no navegador.

```bash
npm run build       # valida tipos e gera o frontend
npm run typecheck   # valida TypeScript e componentes Vue
npm run backend:run # inicia a API em modo de desenvolvimento
npm run backend:build
```

A API disponibiliza `GET /health` e `GET /api/v1/contexto`. Para resolver um tenant, envie um GUID no cabeçalho `X-Tenant-Id`; o health check permanece disponível sem esse cabeçalho.

## Estrutura

```text
src/
  Backend/
    Bonix.Api/
    Bonix.Aplicacao/
    Bonix.Dominio/
    Bonix.Infraestrutura/
    Bonix.Contratos/
  Frontend/
    administrativo/
    portal-cliente/
    site-institucional/
testes/
docs/
scripts/
infraestrutura/
```

## Publicação do administrativo

O administrativo pode ser publicado na Vercel como SPA. Configure o Root Directory para `src/Frontend/administrativo`; o `vercel.json` nessa pasta redireciona as rotas da aplicação para `index.html`. O build pode ser executado localmente com `npm run build`.

## Escopo desta versão

O administrativo demonstrativo inclui autenticação local por perfil, permissões de navegação, dashboard com indicadores, listagem e manutenção básica de campanhas, clientes pesquisáveis e páginas iniciais de agendamentos, bônus, relatórios e configurações. Campanhas e sessão são persistidas no navegador.

Ainda não estão implementados persistência ou autenticação reais, integração entre frontend e API, funcionalidades completas para portal/site, relatórios exportáveis nem integrações com ERP/PDV. A API e as demais áreas estão preparadas como ponto de partida, sem credenciais ou segredos.

Veja [a documentação de arquitetura](docs/arquitetura.md) para os limites e próximos passos.
