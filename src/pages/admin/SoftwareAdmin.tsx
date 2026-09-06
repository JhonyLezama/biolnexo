import { useEffect, useState } from "react";
import { usePageTitle } from "../../components/ui";
import { IconCheck, IconClose, IconExternal } from "../../components/icons";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { fetchSoftwareProjects } from "../../data/content";
import type { SoftwareProject } from "../../types";

export default function SoftwareAdmin() {
  usePageTitle("Software — BiolNexo Admin");
  const [projects, setProjects] = useState<SoftwareProject[]>([]);
  const [editing, setEditing] = useState<SoftwareProject | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const data = await fetchSoftwareProjects();
    setProjects(data);
  };
  useEffect(() => { load(); }, []);

  const startNew = () => {
    setEditing({
      slug: `soft-${Date.now().toString(36)}`,
      titulo: "Nuevo software salud",
      resumen: "Resumen viral 2 líneas",
      coverImage: "https://picsum.photos/800/500",
      videoUrl: "",
      downloadUrl: "",
      repoUrl: "https://github.com/JhonyLezama/biolnexo",
      stack: ["React"],
      areaSalud: "Nutrición",
      destacado: false,
    });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.titulo.trim() || !editing.slug.trim()) { setMsg("Título y slug requeridos"); return; }
    if (isSupabaseConfigured && supabase) {
      const payload = {
        slug: editing.slug,
        titulo: editing.titulo,
        resumen: editing.resumen,
        cover_image: editing.coverImage,
        video_url: editing.videoUrl || null,
        download_url: editing.downloadUrl || null,
        repo_url: editing.repoUrl || null,
        stack: editing.stack,
        area_salud: editing.areaSalud,
        destacado: !!editing.destacado,
      };
      const { error } = await supabase.from("software_projects").upsert(payload, { onConflict: "slug" });
      if (error) { setMsg(`Error: ${error.message}`); setTimeout(()=>setMsg(null),4000); return; }
    }
    setProjects(prev => {
      const idx = prev.findIndex(p => p.slug === editing.slug);
      if (idx >= 0) { const c=[...prev]; c[idx]=editing; return c; }
      return [editing, ...prev];
    });
    setMsg(isNew ? "Creado ✓" : "Actualizado ✓");
    setEditing(null); setIsNew(false);
    setTimeout(()=>setMsg(null),2500);
  };

  const remove = async (slug: string) => {
    if (!confirm(`¿Eliminar ${slug}?`)) return;
    if (isSupabaseConfigured && supabase) await supabase.from("software_projects").delete().eq("slug", slug);
    setProjects(prev => prev.filter(p => p.slug !== slug));
  };

  if (editing) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-5 md:px-8 py-8">
        <button onClick={()=>{setEditing(null); setIsNew(false);}} className="font-mono text-[12px] text-primary hover:underline">← Volver</button>
        <h1 className="mt-3 font-display font-bold text-2xl text-ink">{isNew ? "Nuevo software" : "Editar software"}</h1>
        <div className="mt-6 grid gap-4 bg-white border border-line rounded-2xl p-6">
          <div><label className="font-mono text-[11px] text-muted">Slug</label><input value={editing.slug} onChange={e=>setEditing({...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g,"-")})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] font-mono" /></div>
          <div><label className="font-mono text-[11px] text-muted">Título</label><input value={editing.titulo} onChange={e=>setEditing({...editing, titulo: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 font-semibold" /></div>
          <div><label className="font-mono text-[11px] text-muted">Resumen</label><textarea value={editing.resumen} onChange={e=>setEditing({...editing, resumen: e.target.value})} rows={2} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
          <div><label className="font-mono text-[11px] text-muted">Cover imagen URL o archivo</label><input value={editing.coverImage || ""} onChange={e=>setEditing({...editing, coverImage: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" placeholder="https://..." /><label className="mt-2 inline-flex px-3 py-1.5 rounded-full bg-mist border border-line font-mono text-[11px] cursor-pointer">Subir archivo<input type="file" accept="image/*,video/*" className="hidden" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; if(isSupabaseConfigured && supabase){ const name=`covers/${Date.now()}-${f.name}`; const {error}=await supabase.storage.from("covers").upload(name,f,{upsert:true}); if(!error){ const {data}=supabase.storage.from("covers").getPublicUrl(name); setEditing({...editing, coverImage: data.publicUrl}); } else setEditing({...editing, coverImage: URL.createObjectURL(f)}); } else setEditing({...editing, coverImage: URL.createObjectURL(f)}); }} /></label></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="font-mono text-[11px] text-muted">Video URL (YouTube)</label><input value={editing.videoUrl || ""} onChange={e=>setEditing({...editing, videoUrl: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div><label className="font-mono text-[11px] text-muted">Download URL</label><input value={editing.downloadUrl || ""} onChange={e=>setEditing({...editing, downloadUrl: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div><label className="font-mono text-[11px] text-muted">Repo URL</label><input value={editing.repoUrl || ""} onChange={e=>setEditing({...editing, repoUrl: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div><label className="font-mono text-[11px] text-muted">Stack (coma separada)</label><input value={editing.stack.join(", ")} onChange={e=>setEditing({...editing, stack: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] font-mono" /></div>
            <div><label className="font-mono text-[11px] text-muted">Área salud</label><input value={editing.areaSalud} onChange={e=>setEditing({...editing, areaSalud: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div className="flex items-center gap-2 mt-6"><input type="checkbox" checked={!!editing.destacado} onChange={e=>setEditing({...editing, destacado: e.target.checked})} /> <span className="font-mono text-[11px]">Destacado</span></div>
          </div>
          <div className="flex gap-3 pt-2"><button onClick={save} className="px-6 py-3 rounded-full bg-primary text-white font-semibold flex items-center gap-2"><IconCheck className="w-4 h-4" />Guardar</button><button onClick={()=>{setEditing(null); setIsNew(false);}} className="px-6 py-3 rounded-full bg-white border border-line font-semibold">Cancelar</button>{msg && <span className="self-center font-mono text-[12px] text-bio">{msg}</span>}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · software ]</p><h1 className="mt-2 font-display font-bold text-3xl text-ink">Software & Salud</h1><p className="font-mono text-[12px] text-muted">Imagen o video + links descarga/repo</p></div>
        <button onClick={startNew} className="px-5 py-3 rounded-full bg-navy text-white font-semibold text-[13px] hover:bg-primary">Nuevo software</button>
      </div>
      {msg && <div className="mt-4 bg-bio-soft border border-bio/20 text-bio font-mono text-[12px] px-4 py-2 rounded-xl">{msg}</div>}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.slug} className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-navy overflow-hidden relative">
              {p.coverImage ? <img src={p.coverImage} alt={p.titulo} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-navy to-primary/40" />}
              {p.destacado && <span className="absolute top-3 right-3 bg-aqua text-white font-mono text-[10px] px-2 py-1 rounded-full">Destacado</span>}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="font-display font-bold text-ink line-clamp-1">{p.titulo}</p>
              <p className="font-mono text-[11px] text-muted">{p.areaSalud} · {p.stack.join(", ")}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{setEditing(p); setIsNew(false);}} className="flex-1 py-2 rounded-full bg-white border border-line font-semibold text-[12px] hover:border-primary/30">Editar</button>
                <button onClick={()=>remove(p.slug)} className="px-3 py-2 rounded-full bg-white border border-line text-warn"><IconClose className="w-4 h-4" /></button>
                {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-full bg-mist border border-line"><IconExternal className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
