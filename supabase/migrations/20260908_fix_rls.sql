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
