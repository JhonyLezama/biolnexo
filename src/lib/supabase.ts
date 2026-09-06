import { createClient } from "@supabase/supabase-js";

const url = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_URL as string | undefined;
const anonKey = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

// Helper para saber si estamos en modo backend real
export function requireSupabase() {
  if (!supabase) throw new Error("Supabase no configurado: define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY");
  return supabase;
}
