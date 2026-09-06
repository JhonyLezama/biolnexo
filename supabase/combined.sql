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

--
-- BiolNexo Backend — nicho 4 slugs + Software & Salud
-- Ejecutar después de 20260906. Replica tipos de src/types.ts

-- 1) Categorías (4 vivas, legado mapeado en app via LEGACY_SLUG_MAP)
create table if not exists categories (
  slug text primary key check (slug in ('biotecnologia','tendencias','experimentos-caseros','software-salud')),
  name text not null,
  tagline text not null,
  description text not null,
  icon text not null,
  tint text not null check (tint in ('primary','bio','aqua'))
);

insert into categories (slug, name, tagline, description, icon, tint) values
  ('biotecnologia','Biotecnología','Ciencia viva, explicada sin jerga.','CRISPR, fermentación, biofármacos y microbios útiles contados de forma viral: qué es, por qué importa y dónde probarlo en casa o en el lab.','helix','bio'),
  ('tendencias','Tendencias','Qué se mueve en bio esta semana.','Noticias cortas 4 min sobre genómica, IA bio y salud: hook, qué pasó, por qué importa y qué sigue. Curado 3×/semana por el agente BiolNexo.','chart','primary'),
  ('experimentos-caseros','Experimentos caseros','Hazlo tú, seguro y visual.','Protocolos friendly para casa/aula o lab: materiales caseros, pasos ≤6, video YouTube y ficha de seguridad. De la fresa al microscopio.','flask','aqua'),
  ('software-salud','Software & Salud','Apps y webs que miden tu salud.','Programas propios de BiolNexo: calculadoras, visores y webs de ciencias. Con captura, video y links de descarga/repositorio.','terminal','primary')
on conflict (slug) do nothing;

-- 2) Actualiza sources check a nuevos 4 slugs
alter table sources drop constraint if exists sources_area_slug_check;
alter table sources add constraint sources_area_slug_check check (area_slug in ('biotecnologia','tendencias','experimentos-caseros','software-salud'));

-- 3) Articles (mapea src/types.Article)
create table if not exists articles (
  slug text primary key,
  title text not null,
  category text not null references categories(slug),
  excerpt text not null,
  date date not null,
  read_min int not null,
  author_id text not null,
  image text not null,
  image_caption text not null,
  tags text[] not null default '{}',
  tier text not null check (tier in ('Investigación publicada','Interpretación BiolNexo','Divulgación científica')),
  featured boolean default false,
  source jsonb not null, -- ArticleSource
  body jsonb not null, -- BodyBlock[]
  "references" jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);
alter table articles enable row level security;
drop policy if exists "public read articles" on articles;
create policy "public read articles" on articles for select using (true);
drop policy if exists "service insert articles" on articles;
create policy "service insert articles" on articles for insert with check (auth.role() = 'service_role');
drop policy if exists "service update articles" on articles;
create policy "service update articles" on articles for update using (auth.role() = 'service_role');

-- 4) Software projects (nuevo tipo)
create table if not exists software_projects (
  slug text primary key,
  titulo text not null,
  resumen text not null,
  cover_image text,
  video_url text,
  download_url text,
  repo_url text,
  stack text[] not null default '{}',
  area_salud text not null,
  destacado boolean default false,
  created_at timestamptz default now()
);
alter table software_projects enable row level security;
drop policy if exists "public read software" on software_projects;
create policy "public read software" on software_projects for select using (true);
drop policy if exists "service write software" on software_projects;
create policy "service write software" on software_projects for all using (auth.role() = 'service_role');

-- 5) Experiments / Datasets / Publications / Authors pueden seguir como seed estático o migrarse luego;
--    por ahora articles + categories + software_projects son backend mínimo viable para nicho viral.
--    RLS drafts ya existe en migración anterior.

-- Seed software inicial (3 demos del content.ts)
insert into software_projects (slug, titulo, resumen, cover_image, video_url, download_url, repo_url, stack, area_salud, destacado) values
  ('calculadora-bio-salud','CalculaBio — Salud a un clic','Calculadora web que estima IMC, TMB y riesgo metabólico con visualización instantánea.','https://image.qwenlm.ai/generated-images/d09a0121-c8c6-4b36-ab90-9faaf26ab323/_result.png','https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://github.com/JhonyLezama/biolnexo/releases/tag/calculabio-v1','https://github.com/JhonyLezama/biolnexo','{React,TypeScript,Tailwind}','Nutrición', true),
  ('visor-fasta','Visor FASTA BiolNexo','Pega tu secuencia y ve GC%, traducción y motivos en vivo. Ideal para clases de biotecnología.','https://image.qwenlm.ai/generated-images/ac36ddd0-ff9b-4674-9cab-ac7565f90cf6/_result.png',null,null,'https://github.com/JhonyLezama/biolnexo','{Vite,Biopython}','Genómica', false),
  ('analizador-pcr','PCR Check — Validador de cebadores','Valida Tm, dímeros y especificidad de tus primers antes de pedirlos.','https://image.qwenlm.ai/generated-images/47d6d106-0da6-44cc-8fad-d946b3817df0/_result.png','https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://github.com/JhonyLezama/biolnexo','https://github.com/JhonyLezama/biolnexo','{Python,Streamlit}','Biología molecular', false)
on conflict (slug) do nothing;

--
-- Fix RLS para que /admin/borradores pueda leer en demo (anon)
-- En prod, restringir a authenticated con email biolnexo@gmail.com
drop policy if exists "allow anon read pending drafts (demo)" on drafts;
create policy "allow anon read pending drafts (demo)" on drafts
  for select using (status = 'pending_review');

drop policy if exists "allow service all drafts" on drafts;
create policy "allow service all drafts" on drafts
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- sources lectura pública para agente y frontend
drop policy if exists "public read sources" on sources;
create policy "public read sources" on sources for select using (true);

drop policy if exists "service write sources" on sources;
create policy "service write sources" on sources for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

--
-- Demo: permite que el panel admin (anon con localStorage) pueda publicar borradores sin service_role
-- En prod, cambia a authenticated + email check
drop policy if exists "allow anon insert articles demo" on articles;
create policy "allow anon insert articles demo" on articles for insert with check (true);
drop policy if exists "allow anon update articles demo" on articles;
create policy "allow anon update articles demo" on articles for update using (true) with check (true);
drop policy if exists "allow anon update drafts demo" on drafts;
create policy "allow anon update drafts demo" on drafts for update using (true) with check (true);
drop policy if exists "allow anon insert draft_reviews demo" on draft_reviews;
create policy "allow anon insert draft_reviews demo" on draft_reviews for insert with check (true);

--
-- BiolNexo RLS Prod — solo biolnexo@gmail.com puede escribir, público solo lee
-- Reemplaza demo anon policies de 20260910

-- Articles: público lee, solo editor escribe
drop policy if exists "allow anon insert articles demo" on articles;
drop policy if exists "allow anon update articles demo" on articles;
drop policy if exists "public read articles" on articles;
drop policy if exists "service insert articles" on articles;
drop policy if exists "service update articles" on articles;
create policy "public read articles" on articles for select using (true);
create policy "editor insert articles" on articles for insert with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
create policy "editor update articles" on articles for update using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
create policy "editor delete articles" on articles for delete using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

-- Software
drop policy if exists "public read software" on software_projects;
drop policy if exists "service write software" on software_projects;
create policy "public read software" on software_projects for select using (true);
create policy "editor write software" on software_projects for all using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

-- Categories: público lee, editor escribe
drop policy if exists "allow anon read pending drafts (demo)" on drafts;
drop policy if exists "allow service all drafts" on drafts;
drop policy if exists "allow anon update drafts demo" on drafts;
drop policy if exists "allow anon insert draft_reviews demo" on draft_reviews;
-- Drafts: solo editor ve y escribe
create policy "editor read drafts" on drafts for select using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
create policy "editor insert drafts" on drafts for insert with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
create policy "editor update drafts" on drafts for update using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
create policy "editor delete drafts" on drafts for delete using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

drop policy if exists "public read sources" on sources;
drop policy if exists "service write sources" on sources;
create policy "public read sources" on sources for select using (true);
create policy "editor write sources" on sources for all using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

-- Draft reviews
drop policy if exists "allow anon insert draft_reviews demo" on draft_reviews;
create policy "editor read reviews" on draft_reviews for select using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
create policy "editor insert reviews" on draft_reviews for insert with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

-- Categories write
alter table categories enable row level security;
create policy "editor write categories" on categories for all using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
-- Mantener public read para categories (si no existe, créala)
drop policy if exists "public read categories" on categories;
create policy "public read categories" on categories for select using (true);

-- Experiments: si existe tabla, aplica
do $$ begin
  if exists (select 1 from information_schema.tables where table_name='experiments') then
    alter table experiments enable row level security;
    drop policy if exists "public read experiments" on experiments;
    create policy "public read experiments" on experiments for select using (true);
    drop policy if exists "editor write experiments" on experiments;
    create policy "editor write experiments" on experiments for all using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com');
  end if;
end $$;

--
-- Storage bucket covers para BiolNexo (imágenes portada + medios)
-- Ejecuta una vez en SQL Editor
insert into storage.buckets (id, name, public) values ('covers','covers', true)
on conflict (id) do nothing;

-- Políticas: lectura pública, escritura solo editor biolnexo@gmail.com
-- Nota: storage.objects RLS está habilitado por defecto
drop policy if exists "public read covers" on storage.objects;
create policy "public read covers" on storage.objects for select using (bucket_id = 'covers');

drop policy if exists "editor write covers" on storage.objects;
create policy "editor write covers" on storage.objects for insert with check (bucket_id = 'covers' and (auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

drop policy if exists "editor update covers" on storage.objects;
create policy "editor update covers" on storage.objects for update using (bucket_id = 'covers' and (auth.jwt() ->> 'email') = 'biolnexo@gmail.com') with check (bucket_id = 'covers');

drop policy if exists "editor delete covers" on storage.objects;
create policy "editor delete covers" on storage.objects for delete using (bucket_id = 'covers' and (auth.jwt() ->> 'email') = 'biolnexo@gmail.com');

-- Para demo local sin auth, permite anon subir (opcional, comentar en prod):
-- drop policy if exists "allow anon upload covers demo" on storage.objects;
-- create policy "allow anon upload covers demo" on storage.objects for insert with check (bucket_id = 'covers');

--
