import { useEffect, useState } from "react";
import { usePageTitle } from "../../components/ui";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { IconCheck, IconClose, IconExternal } from "../../components/icons";

type FileItem = { name: string; url: string };

export default function MediaAdmin() {
  usePageTitle("Medios — BiolNexo Admin");
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    const sb = supabase!;
    const { data } = await sb.storage.from("covers").list("", { limit: 50, sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      const items: FileItem[] = data.filter(f=>!f.name.startsWith(".")).map(f=>{
        const { data: pub } = sb.storage.from("covers").getPublicUrl(f.name);
        return { name: f.name, url: pub.publicUrl };
      });
      setFiles(items);
    }
  };
  useEffect(()=>{ load(); },[]);

  const upload = async (file: File) => {
    if (!isSupabaseConfigured || !supabase) {
      // fallback local preview
      const u = URL.createObjectURL(file);
      setFiles(prev=>[{name: file.name, url: u}, ...prev]);
      setMsg("Modo local: preview sin Supabase. Configura bucket covers para persistir.");
      setTimeout(()=>setMsg(null),3000);
      return;
    }
    const name = `${Date.now()}-${file.name}`;
    const sb = supabase!;
    const { error } = await sb.storage.from("covers").upload(name, file, { upsert: true });
    if (error) { setMsg(`Error: ${error.message} — crea bucket 'covers' público en Supabase Storage`); setTimeout(()=>setMsg(null),4000); return; }
    const { data } = sb.storage.from("covers").getPublicUrl(name);
    setFiles(prev=>[{name, url: data.publicUrl}, ...prev]);
    setMsg(`Subido ${name} ✓`); setTimeout(()=>setMsg(null),2500);
  };

  const copyUrl = async (u: string) => {
    await navigator.clipboard.writeText(u);
    setMsg("URL copiada ✓"); setTimeout(()=>setMsg(null),1500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · medios ]</p>
      <h1 className="mt-2 font-display font-bold text-3xl text-ink">Medios</h1>
      <p className="mt-1 font-mono text-[12px] text-muted">URL o archivo a Supabase Storage (bucket <code>covers</code>). Usa la URL en editor de bloques.</p>

      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="font-display font-semibold text-ink">Añadir por URL</p>
          <div className="mt-3 flex gap-2">
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." className="flex-1 border border-line rounded-full px-4 py-2.5 text-[13px]" />
            <button onClick={()=>{ if(!url) return; setFiles(prev=>[{name: url.split("/").pop()||"url", url}, ...prev]); setUrl(""); setMsg("Añadido por URL ✓"); setTimeout(()=>setMsg(null),2000); }} className="px-5 py-2.5 rounded-full bg-navy text-white font-semibold text-[13px]">Añadir</button>
          </div>
          <div className="mt-6">
            <p className="font-display font-semibold text-ink">Subir archivo</p>
            <label className="mt-3 flex flex-col items-center justify-center border-2 border-dashed border-line rounded-2xl p-8 hover:border-primary/30 cursor-pointer bg-paper/50">
              <span className="font-mono text-[12px] text-muted">Arrastra o haz clic</span>
              <span className="font-mono text-[11px] text-muted">PNG/WebP/JPG, hasta 5MB</span>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) upload(f); }} />
            </label>
          </div>
          {msg && <div className="mt-4 bg-bio-soft border border-bio/20 text-bio font-mono text-[12px] px-4 py-2 rounded-xl">{msg}</div>}
        </div>

        <div className="bg-white border border-line rounded-2xl p-6">
          <p className="font-display font-semibold text-ink">Cómo usar</p>
          <ol className="mt-3 space-y-2 font-mono text-[12px] text-inksoft list-decimal pl-4">
            <li>Sube o pega URL → copia URL → pega en bloque <code>image.src</code> o <code>software coverImage</code></li>
            <li>Si Supabase no tiene bucket <code>covers</code> (público), créalo en Dashboard → Storage → New bucket</li>
            <li>Archivos locales sin Supabase solo son preview temporal</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map(f => (
          <div key={f.url} className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="aspect-[16/10] bg-mist overflow-hidden">
              {f.url.match(/\.(mp4|webm)$/) ? <video src={f.url} className="w-full h-full object-cover" controls /> : <img src={f.url} alt={f.name} className="w-full h-full object-cover" loading="lazy" />}
            </div>
            <div className="p-3">
              <p className="font-mono text-[11px] text-ink truncate" title={f.name}>{f.name}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={()=>copyUrl(f.url)} className="flex-1 py-1.5 rounded-full bg-mist border border-line font-mono text-[11px] hover:border-primary/30">Copiar URL</button>
                <a href={f.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full bg-white border border-line"><IconExternal className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>
        ))}
        {files.length===0 && <div className="col-span-full bg-white border border-dashed border-line rounded-2xl p-12 text-center font-mono text-[12px] text-muted">Sin archivos — sube uno o añade URL</div>}
      </div>
    </main>
  );
}
