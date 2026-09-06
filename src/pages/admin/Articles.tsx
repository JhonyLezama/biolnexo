import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Reveal, TierBadge, usePageTitle } from "../../components/ui";
import { IconArrow, IconClose, IconCheck, IconBook } from "../../components/icons";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { fetchArticles, categories, authors } from "../../data/content";
import type { Article, BodyBlock, Tier, CategorySlug } from "../../types";

const emptyBlock = (type: BodyBlock["type"]): BodyBlock => {
  switch (type) {
    case "h2": return { type: "h2", text: "Nuevo subtítulo" };
    case "p": return { type: "p", text: "Nuevo párrafo..." };
    case "list": return { type: "list", items: ["Punto 1", "Punto 2"] };
    case "quote": return { type: "quote", text: "Cita destacada" };
    case "image": return { type: "image", src: "https://picsum.photos/800/400", caption: "Descripción de imagen" };
    case "table": return { type: "table", header: ["Col A", "Col B"], rows: [["Dato 1", "Dato 2"]] };
    case "sequence": return { type: "sequence", label: "Secuencia", text: "5′-ATG GCT AAG-3′" };
    case "note": return { type: "note", text: "Nota importante" };
    default: return { type: "p", text: "" };
  }
};

function BlockEditor({ blocks, setBlocks }: { blocks: BodyBlock[]; setBlocks: (b: BodyBlock[]) => void }) {
  const update = (i: number, patch: Partial<BodyBlock>) => {
    const copy = [...blocks];
    copy[i] = { ...copy[i], ...patch } as BodyBlock;
    setBlocks(copy);
  };
  const move = (i: number, dir: number) => {
    const copy = [...blocks];
    const j = i + dir;
    if (j < 0 || j >= copy.length) return;
    const tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
    setBlocks(copy);
  };
  return (
    <div className="grid gap-4">
      {blocks.map((b, i) => (
        <div key={i} className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center justify-between gap-2">
            <select value={b.type} onChange={(e) => { const copy=[...blocks]; copy[i]=emptyBlock(e.target.value as BodyBlock["type"]); setBlocks(copy); }} className="bg-mist border border-line rounded-full px-3 py-1 font-mono text-[11px]">
              <option value="h2">H2</option><option value="p">Párrafo</option><option value="list">Lista</option><option value="quote">Cita</option><option value="image">Imagen</option><option value="table">Tabla</option><option value="sequence">Secuencia</option><option value="note">Nota</option>
            </select>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink">↑</button>
              <button type="button" onClick={() => move(i, 1)} className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink">↓</button>
              <button type="button" onClick={() => setBlocks(blocks.filter((_, j) => j !== i))} className="w-7 h-7 rounded-full bg-warn-soft text-warn border border-warn/20 flex items-center justify-center"><IconClose className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {(b.type === "h2" || b.type === "p" || b.type === "quote" || b.type === "note" || b.type === "sequence") && (
              <>
                {b.type === "sequence" && <input value={b.label || ""} onChange={(e) => update(i, { label: e.target.value })} placeholder="Label" className="w-full border border-line rounded-lg px-3 py-2 text-[13px] font-mono" />}
                <textarea value={b.text || ""} onChange={(e) => update(i, { text: e.target.value })} rows={b.type === "p" ? 3 : 2} className="w-full border border-line rounded-lg px-3 py-2 text-[13px]" placeholder={b.type === "h2" ? "Título" : "Texto"} />
              </>
            )}
            {b.type === "list" && <textarea value={(b.items || []).join("\n")} onChange={(e) => update(i, { items: e.target.value.split("\n").filter(Boolean) })} rows={3} className="w-full border border-line rounded-lg px-3 py-2 text-[13px] font-mono" placeholder="Un item por línea" />}
            {b.type === "image" && (
              <>
                <input value={b.src || ""} onChange={(e) => update(i, { src: e.target.value })} placeholder="URL imagen o /brand/..." className="w-full border border-line rounded-lg px-3 py-2 text-[13px]" />
                <input value={b.caption || ""} onChange={(e) => update(i, { caption: e.target.value })} placeholder="Caption" className="w-full border border-line rounded-lg px-3 py-2 text-[13px]" />
                <div className="flex gap-2 items-center">
                  <label className="px-3 py-1.5 rounded-full bg-mist border border-line font-mono text-[11px] cursor-pointer">Subir archivo
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      if (isSupabaseConfigured && supabase) {
                        const name = `covers/${Date.now()}-${file.name}`;
                        const { error } = await supabase.storage.from("covers").upload(name, file, { upsert: true });
                        if (!error) {
                          const { data } = supabase.storage.from("covers").getPublicUrl(name);
                          update(i, { src: data.publicUrl });
                        } else {
                          // fallback local preview
                          update(i, { src: URL.createObjectURL(file) });
                        }
                      } else {
                        update(i, { src: URL.createObjectURL(file) });
                      }
                    }} />
                  </label>
                  <span className="font-mono text-[11px] text-muted truncate">{b.src?.slice(0, 40)}</span>
                </div>
              </>
            )}
            {b.type === "table" && (
              <>
                <input value={(b.header || []).join(", ")} onChange={(e) => update(i, { header: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} placeholder="Headers coma separada" className="w-full border border-line rounded-lg px-3 py-2 text-[13px] font-mono" />
                <textarea value={(b.rows || []).map(r => r.join(", ")).join("\n")} onChange={(e) => update(i, { rows: e.target.value.split("\n").map(l => l.split(",").map(s => s.trim())) })} rows={3} className="w-full border border-line rounded-lg px-3 py-2 text-[13px] font-mono" placeholder="Filas: col1, col2 por línea" />
              </>
            )}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {(["h2","p","list","quote","image","table","sequence","note"] as const).map(t => (
          <button key={t} type="button" onClick={() => setBlocks([...blocks, emptyBlock(t)])} className="px-3 py-1.5 rounded-full bg-white border border-line font-mono text-[11px] hover:border-primary/30">+ {t}</button>
        ))}
      </div>
    </div>
  );
}

export default function AdminArticles() {
  usePageTitle("Artículos — BiolNexo Admin");
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const data = await fetchArticles();
    setArticles(data);
  };
  useEffect(() => { load(); }, []);

  const filtered = articles.filter(a => !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.tags.join(" ").toLowerCase().includes(q.toLowerCase()));

  const startNew = () => {
    const now = new Date().toISOString().slice(0,10);
    setEditing({
      slug: `nuevo-${Date.now().toString(36)}`,
      title: "Nuevo artículo biotecnología viral",
      category: "biotecnologia",
      excerpt: "Resumen atractivo 2 líneas para redes.",
      date: now,
      readMin: 5,
      authorId: authors[0].id,
      image: "https://picsum.photos/800/600",
      imageCaption: "Imagen de portada",
      tags: ["biotecnologia"],
      tier: "Divulgación científica",
      featured: false,
      source: { journal: "BiolNexo", year: new Date().getFullYear(), doi: `10.5281/biolnexo.demo.${Date.now().toString().slice(-4)}`, url: "https://doi.org/", license: "CC BY-NC 4.0", type: "Divulgación" },
      body: [{ type: "h2", text: "Introducción" }, { type: "p", text: "Empieza aquí..." }],
      references: [{ text: "Fuente demo", url: "https://doi.org/" }],
    });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    // validación mínima
    if (!editing.title.trim() || !editing.slug.trim()) { setMsg("Título y slug requeridos"); setSaving(false); return; }
    if (isSupabaseConfigured && supabase) {
      const payload = {
        slug: editing.slug,
        title: editing.title,
        category: editing.category,
        excerpt: editing.excerpt,
        date: editing.date,
        read_min: editing.readMin,
        author_id: editing.authorId,
        image: editing.image,
        image_caption: editing.imageCaption,
        tags: editing.tags,
        tier: editing.tier,
        featured: editing.featured,
        source: editing.source,
        body: editing.body,
        references: editing.references,
      };
      const { error } = await supabase.from("articles").upsert(payload, { onConflict: "slug" });
      if (error) { setMsg(`Error Supabase: ${error.message}`); setSaving(false); setTimeout(()=>setMsg(null),4000); return; }
    }
    // local fallback update
    setArticles(prev => {
      const idx = prev.findIndex(a => a.slug === editing.slug);
      if (idx >= 0) { const copy=[...prev]; copy[idx]=editing; return copy; }
      return [editing, ...prev];
    });
    setMsg(isNew ? "Creado ✓" : "Actualizado ✓");
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    setTimeout(()=>setMsg(null),2500);
  };

  const remove = async (slug: string) => {
    if (!confirm(`¿Eliminar ${slug}?`)) return;
    if (isSupabaseConfigured && supabase) await supabase.from("articles").delete().eq("slug", slug);
    setArticles(prev => prev.filter(a => a.slug !== slug));
  };

  if (editing) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-5 md:px-8 py-8">
        <button onClick={() => { setEditing(null); setIsNew(false); }} className="font-mono text-[12px] text-primary hover:underline">← Volver al listado</button>
        <h1 className="mt-3 font-display font-bold text-2xl text-ink">{isNew ? "Nuevo artículo" : "Editar artículo"}</h1>
        <div className="mt-6 grid gap-6 bg-white border border-line rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="font-mono text-[11px] text-muted">Slug (url)</label><input value={editing.slug} onChange={e=>setEditing({...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g,"-")})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] font-mono" /></div>
            <div><label className="font-mono text-[11px] text-muted">Categoría (4 slugs)</label><select value={editing.category} onChange={e=>setEditing({...editing, category: e.target.value as CategorySlug})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] bg-white"><option value="biotecnologia">biotecnologia</option><option value="tendencias">tendencias</option><option value="experimentos-caseros">experimentos-caseros</option><option value="software-salud">software-salud</option></select></div>
            <div className="sm:col-span-2"><label className="font-mono text-[11px] text-muted">Título</label><input value={editing.title} onChange={e=>setEditing({...editing, title: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2.5 font-display font-semibold text-[16px]" /></div>
            <div className="sm:col-span-2"><label className="font-mono text-[11px] text-muted">Excerpt (para redes, 2 líneas)</label><textarea value={editing.excerpt} onChange={e=>setEditing({...editing, excerpt: e.target.value})} rows={2} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div><label className="font-mono text-[11px] text-muted">Fecha</label><input type="date" value={editing.date} onChange={e=>setEditing({...editing, date: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div><label className="font-mono text-[11px] text-muted">Min lectura</label><input type="number" value={editing.readMin} onChange={e=>setEditing({...editing, readMin: parseInt(e.target.value)||5})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div><label className="font-mono text-[11px] text-muted">Tier</label><select value={editing.tier} onChange={e=>setEditing({...editing, tier: e.target.value as Tier})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] bg-white"><option>Divulgación científica</option><option>Interpretación BiolNexo</option><option>Investigación publicada</option></select></div>
            <div><label className="font-mono text-[11px] text-muted">Autor</label><select value={editing.authorId} onChange={e=>setEditing({...editing, authorId: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] bg-white">{authors.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
            <div><label className="font-mono text-[11px] text-muted">Imagen URL o archivo</label><input value={editing.image} onChange={e=>setEditing({...editing, image: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" placeholder="https://..." /><label className="mt-2 inline-flex px-3 py-1.5 rounded-full bg-mist border border-line font-mono text-[11px] cursor-pointer">Subir archivo<input type="file" accept="image/*" className="hidden" onChange={async e=>{ const f=e.target.files?.[0]; if(!f) return; if(isSupabaseConfigured && supabase){ const name=`covers/${Date.now()}-${f.name}`; const {error}=await supabase.storage.from("covers").upload(name,f,{upsert:true}); if(!error){ const {data}=supabase.storage.from("covers").getPublicUrl(name); setEditing({...editing, image: data.publicUrl}); } else setEditing({...editing, image: URL.createObjectURL(f)}); } else setEditing({...editing, image: URL.createObjectURL(f)}); }} /></label></div>
            <div><label className="font-mono text-[11px] text-muted">Caption</label><input value={editing.imageCaption} onChange={e=>setEditing({...editing, imageCaption: e.target.value})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px]" /></div>
            <div className="sm:col-span-2"><label className="font-mono text-[11px] text-muted">Tags (coma separada)</label><input value={editing.tags.join(", ")} onChange={e=>setEditing({...editing, tags: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} className="mt-1 w-full border border-line rounded-xl px-3 py-2 text-[13px] font-mono" /></div>
            <div><label className="font-mono text-[11px] text-muted flex items-center gap-2"><input type="checkbox" checked={!!editing.featured} onChange={e=>setEditing({...editing, featured: e.target.checked})} /> Destacado</label></div>
          </div>

          <div className="border-t border-line pt-6">
            <p className="font-display font-bold text-ink">Cuerpo — editor de bloques</p>
            <p className="font-mono text-[11px] text-muted">Recomendado: h2 → p → list/quote → image/table → note. Reordena con ↑↓</p>
            <div className="mt-4"><BlockEditor blocks={editing.body} setBlocks={(b)=>setEditing({...editing, body: b})} /></div>
          </div>

          <div className="border-t border-line pt-6 grid sm:grid-cols-2 gap-4">
            <div><label className="font-mono text-[11px] text-muted">Source DOI</label><input value={editing.source.doi} onChange={e=>setEditing({...editing, source:{...editing.source, doi: e.target.value}})} className="mt-1 w-full border border-line rounded-lg px-3 py-2 text-[12px] font-mono" /></div>
            <div><label className="font-mono text-[11px] text-muted">Journal</label><input value={editing.source.journal} onChange={e=>setEditing({...editing, source:{...editing.source, journal: e.target.value}})} className="mt-1 w-full border border-line rounded-lg px-3 py-2 text-[13px]" /></div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={saving} className="px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-deep disabled:opacity-50 flex items-center gap-2"><IconCheck className="w-4 h-4" />{saving?"Guardando...": isNew ? "Crear" : "Guardar"}</button>
            <button onClick={()=>{setEditing(null); setIsNew(false);}} className="px-6 py-3 rounded-full bg-white border border-line font-semibold hover:border-primary/30">Cancelar</button>
            {msg && <span className="self-center font-mono text-[12px] text-bio">{msg}</span>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · artículos ]</p>
          <h1 className="mt-2 font-display font-bold text-3xl text-ink">Artículos</h1>
          <p className="mt-1 font-mono text-[12px] text-muted">{filtered.length} total · nicho 4 slugs</p>
        </div>
        <button onClick={startNew} className="px-5 py-3 rounded-full bg-navy text-white font-semibold text-[13px] hover:bg-primary flex items-center gap-2"><IconBook className="w-4 h-4" /> Nuevo artículo</button>
      </div>

      <div className="mt-6 flex gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filtrar por título o tag..." className="flex-1 bg-white border border-line rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-primary" />
        <span className="hidden sm:inline-flex items-center font-mono text-[11px] text-muted">{isSupabaseConfigured ? "Supabase" : "Local"} · {articles.length} cargados</span>
      </div>

      {msg && <div className="mt-4 bg-bio-soft border border-bio/20 text-bio font-mono text-[12px] px-4 py-2 rounded-xl">{msg}</div>}

      <div className="mt-6 grid gap-3">
        {filtered.map(a => (
          <div key={a.slug} className="bg-white border border-line rounded-2xl p-4 grid sm:grid-cols-[1fr_auto] gap-4 items-center">
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink truncate">{a.title}</p>
              <p className="font-mono text-[11px] text-muted mt-1 flex flex-wrap gap-2"><span className="px-2 py-0.5 rounded-full bg-mist border border-line">{a.category}</span><TierBadge tier={a.tier} small /> {a.date} · {a.readMin} min</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to={`/articulo/${a.slug}`} target="_blank" className="px-3 py-2 rounded-full bg-mist border border-line font-mono text-[11px] hover:border-primary/30">Ver →</Link>
              <button onClick={()=>{ setEditing(a); setIsNew(false); }} className="px-4 py-2 rounded-full bg-white border border-line font-semibold text-[12px] hover:border-primary/30">Editar</button>
              <button onClick={()=>remove(a.slug)} className="px-3 py-2 rounded-full bg-white border border-line text-warn hover:border-warn/30"><IconClose className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
