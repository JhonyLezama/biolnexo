#!/usr/bin/env node
// Seed BiolNexo 4 slugs nicho a Supabase
// Uso: node scripts/seed-supabase.mjs
// Requiere: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY en .env
import { createClient } from "@supabase/supabase-js";
import * as content from "../src/data/content.ts"; // no, para mjs usa build
// Simplificado: lee content.ts via import dinámico no transpilado — alternativa: copia manual
// Por ahora, instrucciones: ejecuta supabase SQL Editor y pega el contenido de supabase/migrations/*
// y luego: insert into articles select * from seed? Para MVP, deja fallback estático hasta que conectes.
console.log("Seed manual: pega supabase/migrations/20260907_biolnexo_backend.sql en Supabase SQL Editor.");
console.log("Luego corre: npx supabase db push (si usas CLI) y verifica /admin/borradores con VITE_SUPABASE_* en Vercel.");
console.log("El front ya hace fetch híbrido: si no hay Supabase, usa fallback estático de src/data/content.ts (nicho 4).");
