-- BiolNexo FIX 20260914 — Aprobación manual con login (editor)
-- Problema: "new row violates row-level security policy for table articles"
-- aunque estés logueado como biolnexo@gmail.com.
-- Causa típica: la migración prod 20260912 no se aplicó, o quedó
-- solo con policies service_role (20260907), o el JWT no trae email.
--
-- Este script es idempotente: bórralo y créalo de nuevo sin romper nada.
-- Ejecutar UNA VEZ en Supabase Dashboard → SQL Editor → New query → Run.
--
-- Qué hace:
-- 1. Lectura pública de articles/categories/software/sources (la web sigue abierta)
-- 2. Escritura solo editor biolnexo@gmail.com + service_role (bypass backend)
-- 3. Drafts + reviews solo editor + service_role
-- 4. Verifica al final qué policies quedaron.

-- ============ ARTICLES ============
alter table articles enable row level security;
drop policy if exists "public read articles" on articles;
create policy "public read articles" on articles for select using (true);

drop policy if exists "service insert articles" on articles;
drop policy if exists "service update articles" on articles;
drop policy if exists "allow anon insert articles demo" on articles;
drop policy if exists "allow anon update articles demo" on articles;
drop policy if exists "editor insert articles" on articles;
drop policy if exists "editor update articles" on articles;
drop policy if exists "editor delete articles" on articles;

-- Editor = magic-link biolnexo@gmail.com. service_role hace bypass RLS
-- igual, pero lo incluimos explícito para que el check no falle en logs.
create policy "editor insert articles"
on articles for insert
with check (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);
create policy "editor update articles"
on articles for update
using (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
)
with check (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);
create policy "editor delete articles"
on articles for delete
using (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);

-- ============ DRAFTS ============
alter table drafts enable row level security;
drop policy if exists "allow anon read pending drafts (demo)" on drafts;
drop policy if exists "allow service all drafts" on drafts;
drop policy if exists "allow anon update drafts demo" on drafts;
drop policy if exists "editor read drafts" on drafts;
drop policy if exists "editor insert drafts" on drafts;
drop policy if exists "editor update drafts" on drafts;
drop policy if exists "editor delete drafts" on drafts;

create policy "editor read drafts"
on drafts for select using (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);
create policy "editor insert drafts"
on drafts for insert with check (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);
create policy "editor update drafts"
on drafts for update
using (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
)
with check (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);
create policy "editor delete drafts"
on drafts for delete using (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);

-- ============ DRAFT REVIEWS ============
alter table draft_reviews enable row level security;
drop policy if exists "allow anon insert draft_reviews demo" on draft_reviews;
drop policy if exists "editor read reviews" on draft_reviews;
drop policy if exists "editor insert reviews" on draft_reviews;

create policy "editor read reviews"
on draft_reviews for select using (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);
create policy "editor insert reviews"
on draft_reviews for insert with check (
  (auth.jwt() ->> 'email') = 'biolnexo@gmail.com'
  or auth.role() = 'service_role'
);

-- ============ LECTURA PÚBLICA (no tocar escritura) ============
-- categories / software / sources: público lee
do $$ begin
  if exists (select 1 from information_schema.tables where table_name='categories') then
    alter table categories enable row level security;
    drop policy if exists "public read categories" on categories;
    create policy "public read categories" on categories for select using (true);
    drop policy if exists "editor write categories" on categories;
    create policy "editor write categories" on categories for all
      using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com' or auth.role() = 'service_role')
      with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com' or auth.role() = 'service_role');
  end if;
  if exists (select 1 from information_schema.tables where table_name='software_projects') then
    alter table software_projects enable row level security;
    drop policy if exists "public read software" on software_projects;
    create policy "public read software" on software_projects for select using (true);
    drop policy if exists "service write software" on software_projects;
    drop policy if exists "editor write software" on software_projects;
    create policy "editor write software" on software_projects for all
      using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com' or auth.role() = 'service_role')
      with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com' or auth.role() = 'service_role');
  end if;
  if exists (select 1 from information_schema.tables where table_name='sources') then
    alter table sources enable row level security;
    drop policy if exists "public read sources" on sources;
    create policy "public read sources" on sources for select using (true);
    drop policy if exists "service write sources" on sources;
    drop policy if exists "editor write sources" on sources;
    create policy "editor write sources" on sources for all
      using ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com' or auth.role() = 'service_role')
      with check ((auth.jwt() ->> 'email') = 'biolnexo@gmail.com' or auth.role() = 'service_role');
  end if;
end $$;

-- ============ VERIFICACIÓN ============
-- Debe listar ~11 policies editor + 4 public read.
-- Si está vacío, la tabla no existe o falló el script.
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where tablename in ('articles','drafts','draft_reviews','categories','software_projects','sources')
order by tablename, policyname;
