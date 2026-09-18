# DOC Alpha — Last Minute Outings

Aplicação Next.js (App Router) + TypeScript + Tailwind CSS, deployada na Vercel.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- ESLint (`eslint-config-next`)
- Supabase (migrações em `supabase/migrations/`)

## Estrutura de pastas

```
app/                    # Rotas, layouts e páginas (App Router)
components/             # Componentes React compartilhados
lib/                    # Utilitários, clientes e lógica de negócio
supabase/migrations/    # Migrações SQL do Supabase
public/                 # Assets estáticos
```

## Setup local

Pré-requisito: Node.js 20+ (recomendado 22 LTS) e npm.

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

| Variável | Escopo | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | Chave anônima (pública) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Chave de serviço — nunca expor ao cliente |
| `DIAGNOSTIC_TOKEN` | server | Bearer token da rota `GET /api/health/supabase` (temporária) |

Variáveis com prefixo `NEXT_PUBLIC_` vão para o bundle do browser — nunca coloque segredos nelas.

## Mapa de ambientes

Um único projeto na Vercel; dois projetos Supabase (`docalpha-prod` e `docalpha-dev`), ligados por escopo de variável de ambiente:

| Ambiente Vercel | Quando é usado | Banco |
|---|---|---|
| Production | branch `main` | `docalpha-prod` |
| Preview | demais branches e PRs | `docalpha-dev` |
| Development | `vercel dev` / `.env.local` | `docalpha-dev` |

Project refs: `docalpha-prod` → `<preencher>`, `docalpha-dev` → `<preencher>` (coluna "Project ID"/ref no dashboard do Supabase, também embutido no host `https://<ref>.supabase.co`).

**A integração nativa Supabase ↔ Vercel não é usada** — ela não permite dois bancos no mesmo projeto Vercel e uma ressincronização sobrescreveria a configuração manual. Mantenha-a desconectada.

## Migrations

Migrations versionadas em `supabase/migrations/`, aplicadas via Supabase CLI (instalado como devDependency — não há ambiente local com Docker):

```bash
npx supabase link --project-ref <ref-do-docalpha-dev>   # exige SUPABASE_ACCESS_TOKEN no ambiente
npx supabase migration new <nome>
npx supabase db push                                   # aplica no banco linkado (dev)
npx supabase gen types typescript --linked > lib/database.types.ts
```

Regras:

- **Nunca alterar o esquema pelo Table Editor do painel** — isso faz banco e migrations divergirem. Se houver divergência, `npx supabase db pull` gera a migration do estado remoto.
- **Produção não recebe `db push` manual.** O workflow `.github/workflows/supabase-migrations.yml` aplica as migrations pendentes no `docalpha-prod` a cada push em `main` que altere `supabase/migrations/` (ou via `workflow_dispatch`).
- Verificação de "aplica do zero": projeto Supabase descartável ou reset do `docalpha-dev` — nunca do `docalpha-prod`.

### Secrets do repositório (GitHub → Settings → Secrets and variables → Actions)

| Secret | Valor |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Access token da conta Supabase (supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_ID` | Project ref do `docalpha-prod` |
| `SUPABASE_DB_PASSWORD` | Senha do banco do `docalpha-prod` |

## Deploy

O repositório está conectado à Vercel:

- Push em `main` → deploy em **produção** (`.vercel.app` por enquanto; subdomínio do clube a configurar).
- Push em qualquer branch / PR aberta → **preview deployment** com URL própria.

## Notas

- **Plano Hobby da Vercel:** tarefas agendadas (Cron Jobs) rodam no máximo **uma vez por dia**, com precisão de **±59 minutos**. Isso condiciona o design da issue 26.
- `npm run build` e `npm run lint` devem passar limpos localmente e no CI da Vercel.
