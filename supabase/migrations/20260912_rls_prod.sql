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
