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
