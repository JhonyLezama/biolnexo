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
