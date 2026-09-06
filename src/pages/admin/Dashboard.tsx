import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, Stat, usePageTitle } from "../../components/ui";
import { IconArrow, IconCheck } from "../../components/icons";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function AdminDashboard() {
  usePageTitle("Dashboard — BiolNexo Admin");
  const [stats, setStats] = useState({ categories: 0, software: 0, articles: 0, drafts: 0, experiments: 0 });
  const [backend, setBackend] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    setBackend(true);
    Promise.all([
      supabase.from("categories").select("slug", { count: "exact", head: true }),
      supabase.from("software_projects").select("slug", { count: "exact", head: true }),
      supabase.from("articles").select("slug", { count: "exact", head: true }),
      supabase.from("drafts").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    ]).then(([c, s, a, d]) => {
      setStats({
        categories: c.count ?? 0,
        software: s.count ?? 0,
        articles: a.count ?? 0,
        drafts: d.count ?? 0,
        experiments: 5, // static fallback, luego tabla experiments
      });
    });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · dashboard ]</p>
        <h1 className="mt-2 font-display font-bold text-3xl text-ink">Hola, editor 👋</h1>
        <p className="mt-2 text-[14px] text-inksoft max-w-xl">Gestiona biotecnología viral, tendencias, experimentos caseros y software. Todo lo que apruebes aquí se publica con share manual a redes.</p>
        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] px-3 py-1 rounded-full border bg-white">
          <span className={`w-2 h-2 rounded-full ${backend ? "bg-bio" : "bg-warn"}`} /> {backend ? "Supabase conectado" : "Modo local (fallback estático)"} · <span className="text-primary font-bold">biolnexo@gmail.com</span>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-line rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Borradores</p>
          <p className="mt-1 font-display font-bold text-3xl text-ink">{stats.drafts}</p>
          <p className="font-mono text-[11px] text-muted">pendientes</p>
          <Link to="/admin/borradores" className="mt-3 inline-flex text-[12px] font-semibold text-primary hover:underline">Revisar →</Link>
        </div>
        <div className="bg-white border border-line rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Artículos DB</p>
          <p className="mt-1 font-display font-bold text-3xl text-ink">{stats.articles}</p>
          <p className="font-mono text-[11px] text-muted">publicados</p>
          <Link to="/admin/articulos" className="mt-3 inline-flex text-[12px] font-semibold text-primary hover:underline">Gestionar →</Link>
        </div>
        <div className="bg-white border border-line rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Software</p>
          <p className="mt-1 font-display font-bold text-3xl text-ink">{stats.software}</p>
          <p className="font-mono text-[11px] text-muted">proyectos</p>
          <Link to="/admin/software" className="mt-3 inline-flex text-[12px] font-semibold text-primary hover:underline">Ver →</Link>
        </div>
        <div className="bg-white border border-line rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Categorías</p>
          <p className="mt-1 font-display font-bold text-3xl text-ink">{stats.categories || 4}</p>
          <p className="font-mono text-[11px] text-muted">nicho 4</p>
          <Link to="/admin/categorias" className="mt-3 inline-flex text-[12px] font-semibold text-primary hover:underline">Editar →</Link>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <Reveal className="lg:col-span-2 bg-white border border-line rounded-2xl p-6">
          <h3 className="font-display font-bold text-ink">Flujo editorial</h3>
          <ol className="mt-4 grid gap-3 font-mono text-[12px] text-inksoft">
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span> Agente genera borrador 3×/sem (ES/EN) → <code>drafts pending_review</code></li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</span> Editor revisa `BodyBlock` + DOI + Tier → Aprueba/Rechaza</li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-bio text-white flex items-center justify-center font-bold">3</span> Aprobado → `articles` + share manual a redes desde <code>/articulo/:slug</code></li>
          </ol>
        </Reveal>
        <Reveal delay={100} className="bg-navy rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-dots-dark opacity-40" aria-hidden />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-aqua">Atajo</p>
            <p className="mt-2 font-display font-bold text-xl">¿Nuevo artículo?</p>
            <p className="mt-2 text-[13px] text-[#9db4ca]">Crea con editor de bloques (h2/p/list/quote/image/table/sequence/note) o espera al agente.</p>
            <Link to="/admin/articulos" className="mt-4 inline-flex items-center gap-2 bg-aqua text-navy rounded-full px-5 py-2.5 font-semibold text-[13px] hover:bg-white transition-colors">Crear artículo <IconArrow className="w-4 h-4" /></Link>
          </div>
        </Reveal>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          { to: "/admin/borradores", title: "Borradores", desc: "Revisar agente", cta: "Abrir" },
          { to: "/admin/software", title: "Software", desc: "Imagen/video + links", cta: "Gestionar" },
          { to: "/admin/medios", title: "Medios", desc: "URL o archivo", cta: "Subir" },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group bg-white border border-line rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all">
            <p className="font-display font-bold text-ink group-hover:text-primary">{c.title}</p>
            <p className="font-mono text-[11px] text-muted mt-1">{c.desc}</p>
            <span className="mt-3 inline-flex text-[12px] font-semibold text-primary">{c.cta} →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
