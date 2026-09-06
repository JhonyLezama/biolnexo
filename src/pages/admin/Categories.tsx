import { useEffect, useState } from "react";
import { usePageTitle } from "../../components/ui";
import { IconCheck } from "../../components/icons";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { categories as fallback } from "../../data/content";
import type { Category } from "../../types";

export default function CategoriesAdmin() {
  usePageTitle("Categorías — BiolNexo Admin");
  const [cats, setCats] = useState<Category[]>(fallback);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from("categories").select("*").then(({ data }) => { if (data?.length) setCats(data as Category[]); });
  }, []);

  const save = async (c: Category) => {
    if (!supabase) return;
    const { error } = await supabase.from("categories").upsert(c, { onConflict: "slug" });
    setMsg(error ? `Error: ${error.message}` : `Guardado ${c.slug} ✓`);
    setTimeout(()=>setMsg(null),2500);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · categorías ]</p>
      <h1 className="mt-2 font-display font-bold text-3xl text-ink">Categorías (4 slugs)</h1>
      <p className="mt-1 font-mono text-[12px] text-muted">Nicho viral: biotecnologia / tendencias / experimentos-caseros / software-salud. Legado mapeado en LEGACY_SLUG_MAP.</p>
      {msg && <div className="mt-4 bg-bio-soft border border-bio/20 text-bio font-mono text-[12px] px-4 py-2 rounded-xl">{msg}</div>}
      <div className="mt-6 grid gap-4">
        {cats.map((c) => (
          <div key={c.slug} className="bg-white border border-line rounded-2xl p-5 grid sm:grid-cols-[1fr_auto] gap-4 items-start">
            <div className="grid gap-3">
              <div className="flex gap-2 items-center"><span className="font-mono text-[11px] bg-mist border border-line px-2 py-1 rounded-full">{c.slug}</span><span className={`px-2 py-1 rounded-full text-[11px] font-mono border ${c.tint==="bio"?"bg-bio-soft text-bio": c.tint==="aqua"?"bg-aqua-soft text-[#0a7586]":"bg-primary/10 text-primary"}`}>{c.tint}</span></div>
              <input value={c.name} onChange={e=>setCats(prev=>prev.map(x=>x.slug===c.slug?{...x, name:e.target.value}:x))} className="w-full border border-line rounded-xl px-3 py-2 font-semibold" />
              <input value={c.tagline} onChange={e=>setCats(prev=>prev.map(x=>x.slug===c.slug?{...x, tagline:e.target.value}:x))} className="w-full border border-line rounded-xl px-3 py-2 text-[13px] font-mono text-muted" />
              <textarea value={c.description} onChange={e=>setCats(prev=>prev.map(x=>x.slug===c.slug?{...x, description:e.target.value}:x))} rows={2} className="w-full border border-line rounded-xl px-3 py-2 text-[13px]" />
            </div>
            <button onClick={()=>save(c)} className="self-start px-5 py-2.5 rounded-full bg-navy text-white font-semibold text-[13px] hover:bg-primary flex items-center gap-2"><IconCheck className="w-4 h-4" />Guardar</button>
          </div>
        ))}
      </div>
      <div className="mt-6 font-mono text-[11px] text-muted">Para añadir 5º slug, edita <code>src/types.ts CategorySlug</code> + inserta en DB.</div>
    </main>
  );
}
