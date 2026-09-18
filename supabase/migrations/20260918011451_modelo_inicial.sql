-- Tabela temporária usada pela rota de diagnóstico (/api/health/supabase)
-- para validar leitura+escrita em cada ambiente. O schema real do domínio
-- chega na issue 05 (BRO-153).
create table public.diagnostic_checks (
  id bigint generated always as identity primary key,
  note text not null,
  created_at timestamptz not null default now()
);

alter table public.diagnostic_checks enable row level security;
