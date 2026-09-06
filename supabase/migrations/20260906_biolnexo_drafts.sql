-- BiolNexo — Agente asistido 3×/semana, ES/EN, human-in-the-loop
-- Fase A sin LLM: solo recolección DOI + panel /admin/borradores (pending_review)
-- Activar con LLM_ENABLED=true + GEMINI_API_KEY

-- sources: DOI/URL verificables de PubMed/Crossref/OpenAlex/GenBank/GBIF/PDB
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  doi text unique,
  title text not null,
  url text,
  area_slug text not null check (area_slug in ('biologia','bioinformatica','biotecnologia','ia-cientifica','ecologia','tecnologia','ciencia-datos','investigacion')),
  lang text not null check (lang in ('es','en')),
  fetched_at timestamptz default now(),
  hash text
);

-- drafts: borradores tipados BodyBlock, nunca públicos hasta approved
create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  area_slug text not null,
  lang text not null check (lang in ('es','en')),
  tier text not null check (tier in ('Investigación publicada','Interpretación BiolNexo','Divulgación científica')),
  title text not null,
  slug text unique,
  excerpt text,
  body_json jsonb not null, -- BodyBlock[]
  "references" jsonb not null default '[]'::jsonb,
  source_ids uuid[] default '{}',
  source_doi text,
  status text not null default 'pending_review' check (status in ('pending_review','approved','rejected')),
  created_by text default 'agent',
  created_at timestamptz default now()
);

create table if not exists draft_reviews (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references drafts(id) on delete cascade,
  editor text not null, -- biolnexo@gmail.com
  decision text not null check (decision in ('approved','rejected')),
  note text,
  reviewed_at timestamptz default now()
);

-- RLS: solo service_role escribe drafts (agente), anon no ve pending_review
alter table sources enable row level security;
alter table drafts enable row level security;
alter table draft_reviews enable row level security;

-- cron 3×/semana se configura fuera (Supabase Cron / Vercel Cron -> scripts/agent_draft.py lunes/miércoles/viernes 06:00 UTC)
-- Ejemplo insert mock:
-- insert into sources (doi, title, area_slug, lang, url) values ('10.5281/biolnexo.demo.0001','Demo','bioinformatica','es','https://doi.org/10.5281/biolnexo.demo.0001');
