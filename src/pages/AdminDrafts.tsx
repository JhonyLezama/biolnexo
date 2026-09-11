import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, TierBadge, usePageTitle } from "../components/ui";
import { IconCheck, IconClose, IconExternal, IconBook } from "../components/icons";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type Draft = {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  area_slug: string;
  lang: "es" | "en";
  tier: string;
  status: string;
  body_json?: unknown;
  references?: { text: string; url?: string }[];
  source_doi?: string;
  created_at?: string;
};

export default function AdminDrafts() {
  usePageTitle("Borradores — BiolNexo Admin");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [backend, setBackend] = useState(false);
  const [stats, setStats] = useState({ categories: 0, software: 0, articles: 0, drafts: 0 });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, Draft>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const load = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setBackend(true);
    const { data: sess } = await supabase.auth.getSession();
    setSessionEmail(sess.session?.user?.email?.toLowerCase() ?? null);
    const { data, error } = await supabase
      .from("drafts")
      .select("id,title,slug,excerpt,area_slug,lang,tier,status,body_json,references,source_doi,created_at")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) {
      setMsg(`No se pueden leer borradores (RLS): ${error.message}. Ejecuta supabase/migrations/20260914_fix_approve_editor.sql y entra con magic-link biolnexo@gmail.com en este navegador.`);
      return;
    }
    if (data) setDrafts(data as Draft[]);
    const [c, s, a, d] = await Promise.all([
      supabase.from("categories").select("slug", { count: "exact", head: true }),
      supabase.from("software_projects").select("slug", { count: "exact", head: true }),
      supabase.from("articles").select("slug", { count: "exact", head: true }),
      supabase.from("drafts").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    ]);
    setStats({ categories: c.count ?? 0, software: s.count ?? 0, articles: a.count ?? 0, drafts: d.count ?? 0 });
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (detail[id] || !supabase) return;
    const { data } = await supabase.from("drafts").select("*").eq("id", id).single();
    if (data) setDetail((p) => ({ ...p, [id]: data as Draft }));
  };

  const approve = async (d: Draft) => {
    const full = detail[d.id] ?? d;
    if (!supabase) return;
    // 1. Verifica sesión editor real (el JWT es lo que evalúa RLS)
    const { data: sess } = await supabase.auth.getSession();
    const email = sess.session?.user?.email?.toLowerCase() ?? null;
    setSessionEmail(email);
    if (email !== "biolnexo@gmail.com") {
      setMsg(`Sin sesión editor (${email ?? "sin sesión"}). Ve a /admin/login, pide el magic-link de biolnexo@gmail.com y ábrelo EN ESTE MISMO navegador. Sin eso, RLS bloquea el insert en articles.`);
      return;
    }
    // Mapeo mínimo a articles: usa slug de draft o genera
    const slug = full.slug || full.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48);
    const payload = {
      slug,
      title: full.title,
      category: full.area_slug,
      excerpt: full.excerpt || full.title.slice(0, 140),
      date: new Date().toISOString().slice(0, 10),
      read_min: 5,
      author_id: "elena",
      image: "https://image.qwenlm.ai/generated-images/153b14d3-31f3-4f8c-91c5-006718061f4b/_result.png",
      image_caption: "Imagen generada para BiolNexo",
      tags: [full.area_slug],
      tier: full.tier,
      featured: false,
      source: full.source_doi
        ? { journal: "BiolNexo", year: new Date().getFullYear(), doi: full.source_doi, url: `https://doi.org/${full.source_doi}`, license: "CC BY-NC 4.0", type: "Borrador agente" }
        : { journal: "BiolNexo", year: new Date().getFullYear(), doi: "pendiente-de-validacion", url: "https://biolnexo.vercel.app", license: "CC BY-NC 4.0", type: "Divulgación" },
      body: full.body_json || [{ type: "p", text: "Contenido generado por agente." }],
      references: full.references || [],
    };
    const { error: insErr } = await supabase.from("articles").insert(payload);
    if (insErr) {
      setMsg(`No se pudo publicar (RLS/DB): ${insErr.message}. El borrador SIGUE pendiente (no se borró). Ejecuta supabase/migrations/20260914_fix_approve_editor.sql en Supabase → SQL Editor y reintenta con sesión biolnexo@gmail.com.`);
      setTimeout(() => setMsg(null), 8000);
      return;
    }
    const { error: updErr } = await supabase.from("drafts").update({ status: "approved" }).eq("id", d.id);
    if (updErr) {
      setMsg(`Artículo publicado como /articulo/${slug}, pero no se pudo marcar el borrador como aprobado: ${updErr.message}. Márcalo manual en Supabase.`);
      setTimeout(() => setMsg(null), 8000);
      load();
      return;
    }
    const { error: revErr } = await supabase.from("draft_reviews").insert({ draft_id: d.id, editor: "biolnexo@gmail.com", decision: "approved", note: "Aprobado desde /admin" });
    if (revErr) {
      setMsg(`Publicado como /articulo/${slug} ✓ (pero no se guardó la revisión: ${revErr.message}).`);
    } else {
      setMsg(`Publicado como /articulo/${slug} ✓`);
    }
    setTimeout(() => setMsg(null), 3000);
    load();
  };

  const reject = async (d: Draft) => {
    if (!supabase) return;
    const { data: sess } = await supabase.auth.getSession();
    const email = sess.session?.user?.email?.toLowerCase() ?? null;
    if (email !== "biolnexo@gmail.com") {
      setMsg(`Sin sesión editor (${email ?? "sin sesión"}). Entra con magic-link biolnexo@gmail.com en este navegador.`);
      return;
    }
    const { error: updErr } = await supabase.from("drafts").update({ status: "rejected" }).eq("id", d.id);
    if (updErr) {
      setMsg(`No se pudo rechazar: ${updErr.message}. Ejecuta el fix RLS 20260914.`);
      setTimeout(() => setMsg(null), 6000);
      return;
    }
    await supabase.from("draft_reviews").insert({ draft_id: d.id, editor: "biolnexo@gmail.com", decision: "rejected" });
    setDrafts((prev) => prev.filter((x) => x.id !== d.id));
    setMsg(`Rechazado ${d.title}`);
    setTimeout(() => setMsg(null), 2500);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-8 pb-24">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · borradores ]</p>
        <h1 className="mt-2 font-display font-bold text-3xl text-ink">Borradores del agente</h1>
        <p className="mt-2 text-[14px] text-inksoft max-w-xl">3×/semana, ES/EN, asistido. Sin aprobación no se publica. Haz clic para previsualizar <code className="font-mono bg-mist px-1 py-0.5 rounded">BodyBlock</code> + DOI.</p>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className={`inline-flex items-center gap-2 font-mono text-[11px] px-3 py-1 rounded-full border ${backend ? "bg-bio-soft text-bio border-bio/20" : "bg-warn-soft text-warn border-warn/20"}`}>
            <span className={`w-2 h-2 rounded-full ${backend ? "bg-bio" : "bg-warn"}`} /> {backend ? "Supabase conectado" : "Modo local"}
          </span>
          <span className="font-mono text-[11px] text-muted">nicho: biotecnologia / tendencias / experimentos-caseros / software-salud</span>
          {backend && (
            <span className={`font-mono text-[11px] px-3 py-1 rounded-full border ${sessionEmail === "biolnexo@gmail.com" ? "bg-bio-soft text-bio border-bio/20" : "bg-warn-soft text-warn border-warn/20"}`}>
              {sessionEmail === "biolnexo@gmail.com" ? `editor: ${sessionEmail}` : `sesión: ${sessionEmail ?? "ninguna"} — entra con magic-link`}
            </span>
          )}
        </div>
        {backend && (
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Categorías", value: stats.categories },
              { label: "Software", value: stats.software },
              { label: "Artículos DB", value: stats.articles },
              { label: "Borradores", value: stats.drafts },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-line rounded-xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{s.label}</p>
                <p className="mt-1 font-display font-bold text-2xl text-ink">{s.value}</p>
              </div>
            ))}
          </div>
        )}
        {msg && <div className="mt-4 bg-navy text-aqua font-mono text-[12px] px-4 py-3 rounded-xl">{msg}</div>}
      </Reveal>

      <div className="mt-6 grid gap-4">
        {drafts.length === 0 ? (
          <div className="bg-white border border-dashed border-line rounded-2xl p-10 text-center">
            <div className="mx-auto w-10 h-10 rounded-xl bg-mist text-muted flex items-center justify-center"><IconBook className="w-5 h-5" /></div>
            <p className="mt-3 font-display font-bold text-ink">Aún sin borradores</p>
            <p className="mt-1 font-mono text-[12px] text-muted">Corre <code>python scripts/agent_draft.py --area tendencias --lang es</code> para generar uno (dry-run).</p>
            <Link to="/admin" className="mt-4 inline-flex text-[13px] font-semibold text-primary hover:underline">Volver al dashboard →</Link>
          </div>
        ) : (
          drafts.map((d) => {
            const isOpen = expanded === d.id;
            const full = detail[d.id] ?? d;
            return (
              <div key={d.id} className="bg-white border border-line rounded-2xl overflow-hidden">
                <button onClick={() => toggle(d.id)} className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-mist/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-ink line-clamp-1">{d.title}</p>
                    <p className="font-mono text-[11px] text-muted mt-1 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-mist border border-line">{d.area_slug}</span>
                      <span>{d.lang} · {d.tier}</span>
                      <span className="text-primary">{d.source_doi || ""}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-transform ${isOpen ? "bg-navy text-white rotate-180" : "bg-white text-muted"}`}>
                    <IconClose className={`w-4 h-4 ${isOpen ? "block" : "hidden"}`} />
                    <span className={`${isOpen ? "hidden" : "block"} font-mono text-[10px]`}>↕</span>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-line/60 bg-paper/50">
                    <div className="mt-4 grid gap-3 font-mono text-[12px] text-inksoft">
                      <p><span className="text-muted">Slug:</span> {full.slug || "auto"}</p>
                      <p><span className="text-muted">Excerpt:</span> {full.excerpt || "—"}</p>
                      <div>
                        <p className="text-muted">Body preview ({Array.isArray(full.body_json) ? (full.body_json as unknown[]).length : 0} bloques):</p>
                        <pre className="mt-2 max-h-48 overflow-auto bg-navy text-aqua p-3 rounded-xl text-[11px] whitespace-pre-wrap break-words">{JSON.stringify(full.body_json, null, 2)}</pre>
                      </div>
                      <div>
                        <p className="text-muted">Referencias:</p>
                        <ul className="mt-1 space-y-1">
                          {(full.references as { text: string; url?: string }[] | undefined)?.map((r, i) => (
                            <li key={i} className="flex gap-2"><span className="text-primary">[{i + 1}]</span><span>{r.text} {r.url && <a href={r.url} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">{r.url.replace("https://", "")} <IconExternal className="w-3 h-3" /></a>}</span></li>
                          )) || <li className="text-muted">—</li>}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button onClick={() => approve(d)} className="px-5 py-2.5 rounded-full bg-bio text-white font-semibold text-[13px] flex items-center gap-2 hover:bg-[#0a7a4d]"><IconCheck className="w-4 h-4" /> Aprobar y publicar</button>
                      <button onClick={() => reject(d)} className="px-5 py-2.5 rounded-full bg-white border border-line font-semibold text-[13px] flex items-center gap-2 hover:border-warn/40"><IconClose className="w-4 h-4" /> Rechazar</button>
                      <Link to={`/articulo/${full.slug || ""}`} className="px-5 py-2.5 rounded-full bg-mist border border-line font-mono text-[12px] hover:border-primary/30">Ver slug →</Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 font-mono text-[11px] text-muted">Editor: <span className="text-primary font-bold">biolnexo@gmail.com</span> · Solo `approved` pasa a `articles` y se comparte manual a redes.</div>
    </main>
  );
}
