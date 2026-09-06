import { useEffect, useState } from "react";
import { usePageTitle } from "../../components/ui";
import { IconCheck, IconClose } from "../../components/icons";
import { experiments as fallback } from "../../data/content";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Experiment } from "../../types";

export default function ExperimentsAdmin() {
  usePageTitle("Experimentos — BiolNexo Admin");
  const [list, setList] = useState<Experiment[]>(fallback);
  const [editing, setEditing] = useState<Experiment | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // En Fase 4, experiments aún es estático; si existe tabla experiments en Supabase, la usa
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.from("experiments").select("*").limit(50).then(({ data, error }) => {
      if (!error && data?.length) setList(data as unknown as Experiment[]);
    });
  }, []);

  const startNew = () => {
    setEditing({
      id: `exp-${Date.now().toString(36)}`,
      title: "Nuevo experimento casero",
      level: "Educativo",
      area: "Biología molecular",
      duration: "30 min",
      difficulty: "Baja",
      objective: "Objetivo viral 1 línea",
      materials: ["Material 1", "Material 2"],
      procedure: ["Paso 1", "Paso 2", "Paso 3"],
      results: "Resultado esperado",
      observations: "Observaciones",
      explanation: "Explicación científica sin jerga",
      safety: ["Seguridad 1"],
      references: [{ text: "Ref demo", url: "https://doi.org/" }],
    });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("experiments").upsert(editing as unknown as Record<string, unknown>, { onConflict: "id" });
      if (error) { setMsg(`Error: ${error.message}`); setTimeout(()=>setMsg(null),3000); return; }
    }
    setList(prev => {
      const idx = prev.findIndex(x => x.id === editing.id);
      if (idx >=0) { const c=[...prev]; c[idx]=editing; return c; }
      return [editing, ...prev];
    });
    setMsg(isNew?"Creado ✓":"Actualizado ✓"); setEditing(null); setIsNew(false); setTimeout(()=>setMsg(null),2000);
  };

  const remove = async (id: string) => {
    if (!confirm(`¿Eliminar ${id}?`)) return;
    if (isSupabaseConfigured && supabase) await supabase.from("experiments").delete().eq("id", id);
    setList(prev => prev.filter(x => x.id !== id));
  };

  if (editing) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-5 md:px-8 py-8">
        <button onClick={()=>{setEditing(null); setIsNew(false);}} className="font-mono text-[12px] text-primary hover:underline">← Volver</button>
        <h1 className="mt-3 font-display font-bold text-2xl text-ink">{isNew?"Nuevo":"Editar"} experimento</h1>
        <div className="mt-6 grid gap-4 bg-white border border-line rounded-2xl p-6">
          <input value={editing.title} onChange={e=>setEditing({...editing, title: e.target.value})} placeholder="Título" className="w-full border border-line rounded-xl px-3 py-2.5 font-semibold" />
          <div className="grid sm:grid-cols-3 gap-3">
            <select value={editing.level} onChange={e=>setEditing({...editing, level: e.target.value as Experiment["level"]})} className="border border-line rounded-xl px-3 py-2 bg-white"><option>Educativo</option><option>Supervisado</option><option>Protocolo de investigación</option></select>
            <input value={editing.duration} onChange={e=>setEditing({...editing, duration: e.target.value})} placeholder="Duración" className="border border-line rounded-xl px-3 py-2" />
            <select value={editing.difficulty} onChange={e=>setEditing({...editing, difficulty: e.target.value as Experiment["difficulty"]})} className="border border-line rounded-xl px-3 py-2 bg-white"><option>Baja</option><option>Media</option><option>Alta</option></select>
          </div>
          <textarea value={editing.objective} onChange={e=>setEditing({...editing, objective: e.target.value})} rows={2} className="w-full border border-line rounded-xl px-3 py-2 text-[13px]" placeholder="Objetivo" />
          <div><label className="font-mono text-[11px] text-muted">Materiales (uno por línea)</label><textarea value={editing.materials.join("\n")} onChange={e=>setEditing({...editing, materials: e.target.value.split("\n").filter(Boolean)})} rows={4} className="mt-1 w-full border border-line rounded-xl px-3 py-2 font-mono text-[13px]" /></div>
          <div><label className="font-mono text-[11px] text-muted">Procedimiento (uno por línea, ≤6 ideal)</label><textarea value={editing.procedure.join("\n")} onChange={e=>setEditing({...editing, procedure: e.target.value.split("\n").filter(Boolean)})} rows={5} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
          <input value={(editing as unknown as { videoUrl?: string }).videoUrl || ""} onChange={e=>setEditing({...editing, videoUrl: e.target.value} as unknown as Experiment)} placeholder="Video URL YouTube (opcional)" className="w-full border border-line rounded-xl px-3 py-2 text-[13px]" />
          <div className="flex gap-3"><button onClick={save} className="px-6 py-3 rounded-full bg-primary text-white font-semibold flex items-center gap-2"><IconCheck className="w-4 h-4" />Guardar</button><button onClick={()=>{setEditing(null); setIsNew(false);}} className="px-6 py-3 rounded-full bg-white border border-line font-semibold">Cancelar</button>{msg && <span className="self-center text-bio font-mono text-[12px]">{msg}</span>}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <div className="flex items-end justify-between gap-4"><div><p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · experimentos ]</p><h1 className="mt-2 font-display font-bold text-3xl text-ink">Experimentos</h1><p className="font-mono text-[12px] text-muted">Video opcional para YouTube friendly</p></div><button onClick={startNew} className="px-5 py-3 rounded-full bg-navy text-white font-semibold text-[13px] hover:bg-primary">Nuevo experimento</button></div>
      {msg && <div className="mt-4 bg-bio-soft border border-bio/20 text-bio font-mono text-[12px] px-4 py-2 rounded-xl">{msg}</div>}
      <div className="mt-6 grid gap-3">
        {list.map(e => (
          <div key={e.id} className="bg-white border border-line rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0"><p className="font-display font-semibold text-ink truncate">{e.title}</p><p className="font-mono text-[11px] text-muted">{e.level} · {e.duration} · {e.difficulty}</p></div>
            <div className="flex gap-2 shrink-0"><button onClick={()=>{setEditing(e); setIsNew(false);}} className="px-4 py-2 rounded-full bg-white border border-line font-semibold text-[12px]">Editar</button><button onClick={()=>remove(e.id)} className="px-3 py-2 rounded-full bg-white border border-line text-warn"><IconClose className="w-4 h-4" /></button></div>
          </div>
        ))}
      </div>
    </main>
  );
}
