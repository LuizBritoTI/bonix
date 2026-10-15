# Arquitetura inicial

## Monorepo

- `src/Frontend/administrativo`: Vue 3, TypeScript, Vite, Tailwind CSS 4, Pinia, Vue Router, TanStack Vue Query, Zod e ícones Lucide. O cliente mock está tipado e separado das telas para permitir a substituição gradual por chamadas HTTP.
- `src/Frontend/portal-cliente` e `src/Frontend/site-institucional`: espaços reservados para as experiências do cliente e de apresentação da marca.
- `src/Backend/Bonix.Api`: composição HTTP, health check e resolução inicial do tenant pelo cabeçalho `X-Tenant-Id`.
- `src/Backend/Bonix.Aplicacao`: contratos de contexto e regras de aplicação.
- `src/Backend/Bonix.Dominio`: modelo e invariantes do domínio, sem dependência de infraestrutura.
- `src/Backend/Bonix.Infraestrutura`: espaço para persistência e integrações.
- `src/Backend/Bonix.Contratos`: tipos expostos pela API.

O contexto do tenant é por requisição e é opcional para endpoints públicos como `/health`. Quando informado, `X-Tenant-Id` deve conter um GUID não vazio. Isso é apenas a base de isolamento: autorização, identidade, resolução do tenant por domínio e filtros de persistência precisam ser implementados antes de uso multi-tenant em produção.

## Dados demonstrativos

O modo mock usa registros fictícios no código. Campanhas e a sessão de demonstração são persistidas em `localStorage`; os indicadores do dashboard simulam uma chamada assíncrona para exercitar estados de carregamento. Não use dados reais de clientes nessa demonstração.

## Próximas etapas

1. Definir identidade, autorização e política de isolamento por tenant.
2. Implementar persistência, migrações, auditoria e testes unitários/de integração.
3. Implementar APIs e substituir gradualmente o serviço mock mantendo os contratos tipados.
4. Completar regras, agendamento, segmentação, relatórios e gestão de parâmetros.
5. Adicionar monitoramento, gestão de segredos e pipeline de publicação para cada aplicação.
