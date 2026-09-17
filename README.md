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

Variáveis com prefixo `NEXT_PUBLIC_` vão para o bundle do browser — nunca coloque segredos nelas.

## Deploy

O repositório está conectado à Vercel:

- Push em `main` → deploy em **produção** (`.vercel.app` por enquanto; subdomínio do clube a configurar).
- Push em qualquer branch / PR aberta → **preview deployment** com URL própria.

## Notas

- **Plano Hobby da Vercel:** tarefas agendadas (Cron Jobs) rodam no máximo **uma vez por dia**, com precisão de **±59 minutos**. Isso condiciona o design da issue 26.
- `npm run build` e `npm run lint` devem passar limpos localmente e no CI da Vercel.
