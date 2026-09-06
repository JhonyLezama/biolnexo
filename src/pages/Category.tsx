import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  articles,
  articlesByCategory,
  categories,
  categoryBySlug,
} from "../data/content";
import type { Tier } from "../types";
import { LEGACY_SLUG_MAP } from "../types";
import { ArticleCard, CategoryCard, catIcons } from "../components/Cards";
import { Reveal, TierBadge, usePageTitle } from "../components/ui";
import { IconArrow, IconSearch } from "../components/icons";

const tiers: (Tier | "Todos")[] = [
  "Todos",
  "Investigación publicada",
  "Interpretación BiolNexo",
  "Divulgación científica",
];

/* ------------------------- Página de categoría ------------------------- */

export function TemaPage() {
  const { slug: rawSlug } = useParams();
  const slug = rawSlug ? (LEGACY_SLUG_MAP[rawSlug] ?? rawSlug) : "";
  const cat = categoryBySlug(slug);

  usePageTitle(cat ? `${cat.name} — BiolNexo` : "Área no encontrada — BiolNexo");

  const [sort, setSort] = useState<"recientes" | "az" | "lectura">("recientes");

  const arts = useMemo(() => {
    const list = articlesByCategory(slug ?? "");
    if (sort === "az") return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "lectura") return [...list].sort((a, b) => a.readMin - b.readMin);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [slug, sort]);

  if (!cat) {
    return (
      <main className="max-w-3xl mx-auto px-5 pt-40 pb-24 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary">
          Error · área desconocida
        </p>
        <h1 className="mt-4 font-display font-bold text-3xl">
          Esta área no existe (todavía).
        </h1>
        <Link to="/ciencia" className="mt-8 inline-flex items-center gap-2 text-primary font-display font-semibold">
          Volver al explorador <IconArrow className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  const Icon = catIcons[cat.icon];
  const others = categories.filter((c) => c.slug !== cat.slug).slice(0, 4);
  const isLegacy = rawSlug !== slug && !!LEGACY_SLUG_MAP[rawSlug ?? ""];

  return (
    <main>
      {/* Encabezado del área */}
      <section className="relative bg-white border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-dots [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-32 md:pt-36 pb-12 md:pb-16">
          <Reveal>
            {isLegacy && (
              <div className="mb-6 rounded-full bg-aqua-soft border border-aqua/20 px-4 py-2 font-mono text-[11px] text-[#0a7586] inline-flex">
                Área <span className="font-bold mx-1">{rawSlug}</span> ahora es <span className="font-bold mx-1">{cat.name}</span> — redirigido
              </div>
            )}
            <nav aria-label="Ruta" className="font-mono text-[11.5px] text-muted">
              <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span className="mx-2 text-line">/</span>
              <Link to="/ciencia" className="hover:text-primary transition-colors">Ciencia</Link>
              <span className="mx-2 text-line">/</span>
              <span className="text-primary">{cat.name}</span>
            </nav>
            <div className="mt-8 flex flex-col md:flex-row md:items-end gap-8 justify-between">
              <div className="max-w-2xl">
                <span className={`inline-flex w-14 h-14 rounded-md items-center justify-center mb-5 ${
                  cat.tint === "bio" ? "bg-bio/10 text-bio" : cat.tint === "aqua" ? "bg-aqua/12 text-[#0a7586]" : "bg-primary/10 text-primary"
                }`}>
                  <Icon className="w-7 h-7" />
                </span>
                <h1 className="font-display font-bold text-[clamp(1.75rem,7vw,2.25rem)] md:text-5xl tracking-tight text-ink">
                  {cat.name}
                </h1>
                <p className="mt-2 font-mono text-[13px] text-primary tracking-wide">
                  {cat.tagline}
                </p>
                <p className="mt-4 text-[15.5px] leading-relaxed text-inksoft">
                  {cat.description}
                </p>
              </div>
              <div className="font-mono text-[12px] text-muted shrink-0 md:text-right">
                <p className="text-3xl font-semibold text-primary tabular-nums">
                  {String(arts.length).padStart(2, "0")}
                </p>
                <p className="mt-1">artículos en el área</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-14 md:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="font-mono text-[12px] text-muted">
            Mostrando <span className="text-primary font-semibold">{arts.length}</span> artículos
          </p>
          <div className="flex gap-2" role="group" aria-label="Ordenar artículos">
            {(
              [
                ["recientes", "Recientes"],
                ["az", "A–Z"],
                ["lectura", "Lectura rápida"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`px-3.5 py-1.5 rounded-full border font-mono text-[11.5px] uppercase tracking-wider transition-all duration-200 ${
                  sort === key
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-inksoft border-line hover:border-primary/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {arts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {arts.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 90}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-line rounded-lg p-12 text-center">
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-muted">
              Área en construcción
            </p>
            <p className="mt-3 text-inksoft max-w-md mx-auto">
              Este espacio crecerá con el contenido real de BiolNexo. Mientras
              tanto, explora las demás áreas de la plataforma.
            </p>
          </div>
        )}

        {/* Otras áreas */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-7">
            <h2 className="font-display font-bold text-2xl text-ink">Otras áreas</h2>
            <Link to="/ciencia" className="inline-flex items-center gap-2 font-display font-semibold text-sm text-primary group">
              Ver todas <IconArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {others.map((c, i) => (
              <Reveal key={c.slug} delay={i * 80}>
                <CategoryCard category={c} count={articlesByCategory(c.slug).length} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* --------------------------- Hub: /ciencia --------------------------- */

export function CienciaHub() {
  usePageTitle("Explorar ciencia — BiolNexo");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todas");
  const [tier, setTier] = useState<Tier | "Todos">("Todos");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return articles
      .filter((a) => cat === "todas" || a.category === cat)
      .filter((a) => tier === "Todos" || a.tier === tier)
      .filter(
        (a) =>
          !term ||
          a.title.toLowerCase().includes(term) ||
          a.excerpt.toLowerCase().includes(term) ||
          a.tags.join(" ").toLowerCase().includes(term),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [q, cat, tier]);

  return (
    <main>
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-60" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-32 md:pt-36 pb-14">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-aqua">
              [ Explorador de contenido ]
            </p>
            <h1 className="mt-4 font-display font-bold text-[clamp(1.75rem,7vw,2.25rem)] md:text-5xl tracking-tight text-white max-w-2xl leading-[1.08]">
              Todo el conocimiento de BiolNexo, en un solo lugar.
            </h1>
            <div className="mt-8 max-w-xl flex items-center gap-3 bg-navy-2 border border-white/15 rounded-md px-4 py-1 focus-within:border-aqua transition-colors">
              <IconSearch className="w-5 h-5 text-aqua shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filtrar por título, tema o etiqueta…"
                className="flex-1 bg-transparent py-3 text-white placeholder:text-[#7e9ab5] outline-none text-[15px]"
                aria-label="Filtrar artículos"
              />
              {q && (
                <button onClick={() => setQ("")} className="font-mono text-[11px] text-[#7e9ab5] hover:text-aqua transition-colors">
                  limpiar
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-5 md:px-8 py-12 md:py-16">
        {/* Filtros */}
        <Reveal>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              <button
                onClick={() => setCat("todas")}
                aria-pressed={cat === "todas"}
                className={`shrink-0 px-4 py-2 min-h-[36px] rounded-full border font-mono text-[11.5px] uppercase tracking-wider transition-all ${
                  cat === "todas" ? "bg-navy text-aqua border-navy" : "bg-white text-inksoft border-line hover:border-primary/40"
                }`}
              >
                Todas las áreas
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCat(c.slug)}
                  aria-pressed={cat === c.slug}
                  className={`shrink-0 px-4 py-2 min-h-[36px] rounded-full border font-mono text-[11.5px] uppercase tracking-wider transition-all ${
                    cat === c.slug ? "bg-navy text-aqua border-navy" : "bg-white text-inksoft border-line hover:border-primary/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <div className="flex flex-nowrap sm:flex-wrap items-center gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted mr-1 shrink-0">Nivel:</span>
              {tiers.map((t) =>
                t === "Todos" ? (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    aria-pressed={tier === t}
                    className={`px-3 py-1.5 rounded-full border font-mono text-[11px] transition-all ${
                      tier === t ? "bg-primary text-white border-primary" : "bg-white text-inksoft border-line hover:border-primary/40"
                    }`}
                  >
                    Todos
                  </button>
                ) : (
                  <button key={t} onClick={() => setTier(t)} aria-pressed={tier === t} className="transition-transform hover:scale-105">
                    <TierBadge tier={t} small />
                  </button>
                ),
              )}
            </div>
          </div>
        </Reveal>

        <p className="mt-8 mb-6 font-mono text-[12px] text-muted">
          {filtered.length} resultado{filtered.length !== 1 && "s"}
          {q.trim() && <> para «<span className="text-primary">{q.trim()}</span>»</>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 80}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-line rounded-lg p-14 text-center">
            <p className="font-mono text-3xl text-primary">∅</p>
            <p className="mt-3 font-display font-bold text-xl text-ink">Sin resultados con esos filtros</p>
            <p className="mt-2 text-[14px] text-inksoft max-w-md mx-auto">
              Prueba a limpiar el buscador o cambiar de área. También puedes usar
              el buscador global para consultar experimentos, datasets e investigación.
            </p>
            <Link to="/busqueda" className="mt-6 inline-flex items-center gap-2 text-primary font-display font-semibold">
              Abrir buscador global <IconArrow className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
