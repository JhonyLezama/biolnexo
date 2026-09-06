-- Fix RLS para que /admin/borradores pueda leer en demo (anon)
-- En prod, restringir a authenticated con email biolnexo@gmail.com
create policy if not exists "allow anon read pending drafts (demo)" on drafts
  for select using (status = 'pending_review');

create policy if not exists "allow service all drafts" on drafts
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- sources lectura pública para agente y frontend
create policy if not exists "public read sources" on sources for select using (true);
create policy if not exists "service write sources" on sources for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
