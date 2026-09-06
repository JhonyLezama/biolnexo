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
