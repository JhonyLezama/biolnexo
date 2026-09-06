import { createClient } from "@supabase/supabase-js";

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const url = (env.VITE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL) as string | undefined;
const anonKey = (env.VITE_SUPABASE_ANON_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

// Helper para saber si estamos en modo backend real
export function requireSupabase() {
  if (!supabase) throw new Error("Supabase no configurado: define VITE_SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y VITE_SUPABASE_ANON_KEY");
  return supabase;
}
