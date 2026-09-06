import { useEffect, useState, useRef } from "react";
import { usePageTitle } from "../../components/ui";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { IconExternal } from "../../components/icons";

type FileItem = { name: string; url: string };

const FALLBACK = "/brand/biolnexo-cover-1640x924.png";

export default function MediaAdmin() {
  usePageTitle("Medios — BiolNexo Admin");
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    const sb = supabase!;
    const { data } = await sb.storage.from("covers").list("", { limit: 80, sortBy: { column: "created_at", order: "desc" } });
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
      const u = URL.createObjectURL(file);
      setFiles(prev=>[{name: file.name, url: u}, ...prev]);
      setMsg("Modo local: preview sin Supabase. Configura bucket covers para persistir.");
      setTimeout(()=>setMsg(null),3000);
      return;
    }
    const name = `${Date.now()}-${file.name.replace(/\s+/g,"-")}`;
    const sb = supabase!;
    const { error } = await sb.storage.from("covers").upload(name, file, { upsert: true });
    if (error) { setMsg(`Error: ${error.message} — crea bucket 'covers' público`); setTimeout(()=>setMsg(null),4000); return; }
    const { data } = sb.storage.from("covers").getPublicUrl(name);
    setFiles(prev=>[{name, url: data.publicUrl}, ...prev]);
    setMsg(`Subido ${name} ✓`); setTimeout(()=>setMsg(null),2500);
  };

  const copyUrl = async (u: string) => {
    await navigator.clipboard.writeText(u);
    setMsg("URL copiada ✓"); setTimeout(()=>setMsg(null),1500);
  };

  const changeImage = async (item: FileItem, newFile: File) => {
    if (!isSupabaseConfigured || !supabase) {
      const u = URL.createObjectURL(newFile);
      setFiles(prev=>prev.map(f=> f.name===item.name ? {...f, url: u} : f));
      setMsg("Reemplazado local (preview) ✓"); setTimeout(()=>setMsg(null),2500);
      return;
    }
    setBusy(item.name);
    const sb = supabase!;
    // Sobrescribe mismo path para que URL no cambie y todos los enlazados se actualicen solos
    const { error } = await sb.storage.from("covers").upload(item.name, newFile, { upsert: true, contentType: newFile.type });
    if (error) { setMsg(`Error al reemplazar: ${error.message}`); setBusy(null); setTimeout(()=>setMsg(null),3000); return; }
    // cache-bust
    const { data } = sb.storage.from("covers").getPublicUrl(item.name);
    const busted = `${data.publicUrl}?t=${Date.now()}`;
    setFiles(prev=>prev.map(f=> f.name===item.name ? {...f, url: busted} : f));
    setMsg(`Imagen reemplazada ✓ — todos los artículos/software enlazados ahora muestran la nueva`); setBusy(null); setTimeout(()=>setMsg(null),3000);
  };

  const deleteWithFallback = async (item: FileItem) => {
    if (!confirm(`¿Borrar definitivamente "${item.name}"?\nSe reemplazará por imagen estándar en artículos/software enlazados.`)) return;
    setBusy(item.name);
    // 1) Busca enlazados y actualiza a FALLBACK
    if (isSupabaseConfigured && supabase) {
      const sb = supabase!;
      try {
        // Artículos donde image == url (exacta sin cache-bust)
        const { data: arts } = await sb.from("articles").select("slug,image").eq("image", item.url);
        if (arts?.length) {
          for (const a of arts) {
            await sb.from("articles").update({ image: FALLBACK, image_caption: "Imagen de respaldo BiolNexo" }).eq("slug", (a as {slug:string}).slug);
          }
        }
        const { data: soft } = await sb.from("software_projects").select("slug,cover_image").eq("cover_image", item.url);
        if (soft?.length) {
          for (const s of soft) {
            await sb.from("software_projects").update({ cover_image: FALLBACK }).eq("slug", (s as {slug:string}).slug);
          }
        }
        // 2) Borra objeto
        const { error } = await sb.storage.from("covers").remove([item.name]);
        if (error) throw error;
        setFiles(prev=>prev.filter(f=>f.name!==item.name));
        const linked = (arts?.length||0) + (soft?.length||0);
        setMsg(linked ? `Borrado y ${linked} enlazado(s) pasaron a imagen estándar ✓` : `Borrado ✓`);
      } catch (e: unknown) {
        const m = e instanceof Error ? e.message : String(e);
        setMsg(`Error al borrar: ${m}`);
      }
    } else {
      setFiles(prev=>prev.filter(f=>f.name!==item.name));
      setMsg("Borrado local ✓");
    }
    setBusy(null); setTimeout(()=>setMsg(null),3000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · medios ]</p>
      <h1 className="mt-2 font-display font-bold text-3xl text-ink">Medios</h1>
      <p className="mt-1 font-mono text-[12px] text-muted">URL o archivo a Supabase Storage (bucket <code>covers</code>). <span className="text-ink font-semibold">Cambiar</span> actualiza en todos los enlazados; <span className="text-warn font-semibold">Borrar</span> pone imagen estándar.</p>

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
          <p className="font-display font-semibold text-ink">Cómo funciona ahora</p>
          <ol className="mt-3 space-y-2 font-mono text-[12px] text-inksoft list-decimal pl-4">
            <li><b>Cambiar</b>: eliges otra imagen → se sobrescribe <code>covers/nombre</code> → todos los artículos/software que usaban esa URL muestran la nueva sin tocar DB.</li>
            <li><b>Borrar</b>: busca enlazados en <code>articles.image</code> y <code>software_projects.cover_image</code> → los pone en <code>{FALLBACK}</code> (estándar) → borra objeto.</li>
            <li>Copia URL con <b>Copiar URL</b> y pega en editor de bloques si prefieres flujo manual.</li>
          </ol>
          <p className="mt-3 font-mono text-[11px] text-muted">Fallback estándar: <code>{FALLBACK}</code> (portada BiolNexo)</p>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map(f => (
          <div key={f.url} className="bg-white border border-line rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-mist overflow-hidden">
              {f.url.match(/\.(mp4|webm)(\?|$)/) ? <video src={f.url} className="w-full h-full object-cover" controls /> : <img src={f.url} alt={f.name} className="w-full h-full object-cover" loading="lazy" />}
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <p className="font-mono text-[11px] text-ink truncate" title={f.name}>{f.name}</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                <button onClick={()=>copyUrl(f.url)} className="py-1.5 rounded-full bg-mist border border-line font-mono text-[11px] hover:border-primary/30">Copiar</button>
                <label className="py-1.5 rounded-full bg-white border border-line font-mono text-[11px] text-center hover:border-primary/30 cursor-pointer">
                  Cambiar
                  <input ref={el=>{ fileRefs.current[f.name]=el; }} type="file" accept="image/*" className="hidden" onChange={e=>{ const nf=e.target.files?.[0]; if(nf) changeImage(f, nf); if(e.target) e.target.value=""; }} />
                </label>
                <button onClick={()=>deleteWithFallback(f)} disabled={busy===f.name} className="py-1.5 rounded-full bg-white border border-line font-mono text-[11px] text-warn hover:border-warn/30 disabled:opacity-50">
                  {busy===f.name ? "..." : "Borrar"}
                </button>
              </div>
              <a href={f.url} target="_blank" rel="noreferrer" className="mt-2 font-mono text-[10px] text-muted hover:text-primary flex items-center gap-1 truncate"><IconExternal className="w-3 h-3 shrink-0" />{f.url.slice(0,38)}…</a>
            </div>
          </div>
        ))}
        {files.length===0 && <div className="col-span-full bg-white border border-dashed border-line rounded-2xl p-12 text-center font-mono text-[12px] text-muted">Sin archivos — sube uno o añade URL</div>}
      </div>
    </main>
  );
}
