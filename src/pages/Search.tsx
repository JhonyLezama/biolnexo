import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  categoryName,
  datasets,
  experiments,
  getAuthor,
  publications,
  useArticles,
} from "../data/content";
import { ArticleCard } from "../components/Cards";
import { Reveal, TierBadge, usePageTitle } from "../components/ui";
import { IconArrow, IconClose, IconSearch } from "../components/icons";

const typeFilters = ["Artículos", "Experimentos", "Datasets", "Investigación"] as const;
type TypeFilter = (typeof typeFilters)[number];

function esc(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Hl({ text, q }: { text: string; q: string }): ReactNode {
  const term = q.trim();
  if (term.length < 2) return text;
  const parts = text.split(new RegExp(`(${esc(term)})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === term.toLowerCase() ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>,
      )}
    </>
  );
}

export default function SearchPage() {
  usePageTitle("Buscador — BiolNexo");
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [types, setTypes] = useState<TypeFilter[]>([...typeFilters]);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const term = q.trim().toLowerCase();
  const allArts = useArticles();

  const toggleType = (t: TypeFilter) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const results = useMemo(() => {
    if (term.length < 2) return null;
    const m = (s: string) => s.toLowerCase().includes(term);
    return {
      arts: allArts.filter(
        (a) =>
          m(a.title) ||
          m(a.excerpt) ||
          m(a.tags.join(" ")) ||
          m(categoryName(a.category)) ||
          m(getAuthor(a.authorId).name) ||
          String(a.source.year).includes(term),
      ),
      exps: experiments.filter((e) => m(e.title) || m(e.objective) || m(e.area)),
      sets: datasets.filter((d) => m(d.name) || m(d.kind) || m(d.description)),
      pubs: publications.filter((p) => m(p.title) || m(p.area) || m(p.question)),
    };
  }, [term, allArts]);

  const submit = () => {
    if (q.trim()) setParams({ q: q.trim() });
    else setParams({});
  };

  const total = results
    ? results.arts.length + results.exps.length + results.sets.length + results.pubs.length
    : 0;

  const popular = ["CRISPR", "genoma", "PCR", "proteínas", "microscopía", "datasets", "filogenia"];

  return (
    <main className="pb-24">
      {/* Hero moderno - sin outline, con glass */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-40" aria-hidden />
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(15,168,192,0.22), transparent 65%)" }}
          aria-hidden
        />
        <div
          className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,78,140,0.35), transparent 65%)" }}
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-5 md:px-8 pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-aqua text-center sm:text-left">
              [ Buscador científico ]
            </p>
            <h1 className="mt-3 font-display font-bold text-[clamp(1.75rem,7vw,2.5rem)] md:text-[2.6rem] tracking-tight text-white leading-[1.08] text-center sm:text-left">
              Busca en todo el conocimiento de la plataforma.
            </h1>
            <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#9db4ca] text-center sm:text-left max-w-xl">
              Artículos, experimentos, datasets e investigación — un solo lugar para explorar BiolNexo.
            </p>

            <form
              className="mt-8 relative flex items-center bg-white rounded-full shadow-[0_12px_32px_rgba(2,14,28,0.22)] border border-line/30 overflow-hidden focus-within:border-aqua/30 focus-within:ring-1 focus-within:ring-aqua/15 focus-within:shadow-[0_12px_32px_rgba(15,168,192,0.14)] transition-all"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <span className="pl-4 sm:pl-5 pr-2 text-muted">
                <IconSearch className="w-5 h-5" />
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Palabras clave, tema, autor, etiqueta…"
                className="flex-1 bg-transparent py-3.5 sm:py-4 outline-none text-[15px] sm:text-[16px] text-ink placeholder:text-muted/70 min-w-0"
                aria-label="Buscar"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setParams({});
                  }}
                  aria-label="Limpiar búsqueda"
                  className="w-8 h-8 rounded-full bg-mist text-muted hover:text-ink hover:bg-line flex items-center justify-center shrink-0 mr-1 transition-colors"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="mr-1.5 sm:mr-1.5 bg-navy text-white font-display font-semibold text-[13px] sm:text-[14px] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-primary hover:text-white transition-colors shrink-0"
              >
                Buscar
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-mono text-[11px] text-[#7e9ab5] hidden sm:inline">Popular:</span>
              {popular.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQ(s);
                    setParams({ q: s });
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] sm:text-[13px] text-[#c3d4e4] hover:bg-white hover:text-navy hover:border-white backdrop-blur-sm transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>

            {results && (
              <p className="mt-6 font-mono text-[12px] text-[#7e9ab5] text-center sm:text-left">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
                  {total} resultado{total !== 1 && "s"} para <span className="text-aqua">«{q.trim()}»</span>
                </span>
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* Filtros tipo - pill moderno sin outline duro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-8">
        <Reveal>
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filtrar por tipo de contenido">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted shrink-0 hidden sm:inline">Filtrar:</span>
            {typeFilters.map((t) => {
              const active = types.includes(t);
              const count = results
                ? t === "Artículos"
                  ? results.arts.length
                  : t === "Experimentos"
                    ? results.exps.length
                    : t === "Datasets"
                      ? results.sets.length
                      : results.pubs.length
                : null;
              return (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  aria-pressed={active}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[12px] font-medium tracking-wide border transition-all duration-200 ${
                    active
                      ? "bg-navy text-white border-navy shadow-[0_4px_12px_rgba(7,26,46,0.15)]"
                      : "bg-white text-inksoft border-line hover:border-primary/30 hover:text-ink hover:shadow-sm"
                  }`}
                >
                  {t}
                  {count !== null && (
                    <span
                      className={`min-w-[20px] h-5 rounded-full text-[11px] font-bold flex items-center justify-center px-1.5 ${
                        active ? "bg-white/15 text-aqua" : "bg-mist text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            {types.length !== typeFilters.length && (
              <button
                onClick={() => setTypes([...typeFilters])}
                className="shrink-0 font-mono text-[11px] text-primary hover:text-primary-deep underline underline-offset-4 ml-1"
              >
                Ver todos
              </button>
            )}
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 mt-8">
        {!results && (
          <Reveal>
            <div className="bg-white rounded-2xl border border-line/60 shadow-sm p-8 sm:p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <IconSearch className="w-6 h-6" />
              </div>
              <p className="mt-4 font-display font-bold text-xl text-ink">Empieza a explorar</p>
              <p className="mt-2 text-[14px] text-inksoft max-w-md mx-auto leading-relaxed">
                Escribe al menos 2 caracteres para buscar en títulos, resúmenes, etiquetas, áreas y autores.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {popular.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQ(s);
                      setParams({ q: s });
                    }}
                    className="px-4 py-2 rounded-full bg-paper border border-line text-[13px] text-inksoft hover:bg-navy hover:text-white hover:border-navy transition-colors"
                  >
                    Probar “{s}”
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {results && total === 0 && (
          <Reveal>
            <div className="bg-white rounded-2xl border border-line/60 shadow-sm p-8 sm:p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-warn-soft text-warn flex items-center justify-center">
                <IconSearch className="w-6 h-6" />
              </div>
              <p className="mt-4 font-display font-bold text-xl text-ink">Sin resultados para «{q.trim()}»</p>
              <p className="mt-2 text-[14px] text-inksoft max-w-md mx-auto">
                Prueba con sinónimos, términos más generales o explora las áreas de BiolNexo.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => {
                    setQ("");
                    setParams({});
                  }}
                  className="px-5 py-2.5 rounded-xl bg-paper border border-line text-[13px] font-semibold text-ink hover:border-primary/30 transition-colors"
                >
                  Limpiar búsqueda
                </button>
                <Link
                  to="/ciencia"
                  className="px-5 py-2.5 rounded-xl bg-navy text-white text-[13px] font-semibold hover:bg-primary transition-colors"
                >
                  Explorar ciencia
                </Link>
              </div>
            </div>
          </Reveal>
        )}

        {results && results.arts.length > 0 && types.includes("Artículos") && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display font-bold text-lg text-ink">Artículos</h2>
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold">
                {results.arts.length}
              </span>
              <div className="h-px flex-1 bg-line/60 hidden sm:block" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.arts.map((a, i) => (
                <Reveal key={a.slug} delay={(i % 3) * 70}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {results && results.exps.length > 0 && types.includes("Experimentos") && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display font-bold text-lg text-ink">Experimentos</h2>
              <span className="px-2.5 py-1 rounded-full bg-bio-soft text-bio font-mono text-[11px] font-bold">
                {results.exps.length}
              </span>
              <div className="h-px flex-1 bg-line/60 hidden sm:block" />
            </div>
            <div className="grid gap-3">
              {results.exps.map((e) => (
                <Link
                  key={e.id}
                  to="/experimentos"
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 bg-white border border-line/60 rounded-2xl px-5 py-4 hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(11,28,44,0.06)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[15px] sm:text-[15.5px] text-ink group-hover:text-primary transition-colors line-clamp-2">
                      <Hl text={e.title} q={q} />
                    </p>
                    <p className="font-mono text-[11px] sm:text-[11.5px] text-muted mt-1 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-mist border border-line text-[10px]">{e.level}</span>
                      <span>{e.area} · {e.duration}</span>
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-xl bg-mist text-ink group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <IconArrow className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {results && results.sets.length > 0 && types.includes("Datasets") && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display font-bold text-lg text-ink">Datasets</h2>
              <span className="px-2.5 py-1 rounded-full bg-aqua-soft text-[#0a7586] font-mono text-[11px] font-bold">
                {results.sets.length}
              </span>
              <div className="h-px flex-1 bg-line/60 hidden sm:block" />
            </div>
            <div className="grid gap-3">
              {results.sets.map((d) => (
                <Link
                  key={d.id}
                  to="/datos"
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 bg-white border border-line/60 rounded-2xl px-5 py-4 hover:border-aqua/30 hover:shadow-[0_8px_24px_rgba(11,28,44,0.06)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[15px] sm:text-[15.5px] text-ink group-hover:text-primary transition-colors truncate">
                      <Hl text={d.name} q={q} />
                    </p>
                    <p className="font-mono text-[11px] sm:text-[11.5px] text-muted mt-1 truncate">
                      {d.org} · {d.records}
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-xl bg-mist text-ink group-hover:bg-aqua group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <IconArrow className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {results && results.pubs.length > 0 && types.includes("Investigación") && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display font-bold text-lg text-ink">Investigación</h2>
              <span className="px-2.5 py-1 rounded-full bg-navy text-aqua font-mono text-[11px] font-bold">
                {results.pubs.length}
              </span>
              <div className="h-px flex-1 bg-line/60 hidden sm:block" />
            </div>
            <div className="grid gap-3">
              {results.pubs.map((p) => (
                <Link
                  key={p.id}
                  to="/investigacion"
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 bg-white border border-line/60 rounded-2xl px-5 py-4 hover:border-primary/20 hover:shadow-[0_8px_24px_rgba(11,28,44,0.06)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-[15px] sm:text-[15.5px] text-ink group-hover:text-primary transition-colors line-clamp-2">
                      <Hl text={p.title} q={q} />
                    </p>
                    <p className="font-mono text-[11px] sm:text-[11.5px] text-muted mt-1 line-clamp-1">
                      {p.authors.join(", ")} · {p.year} · <TierBadge tier="Investigación publicada" small />
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-xl bg-mist text-ink group-hover:bg-navy group-hover:text-aqua flex items-center justify-center shrink-0 transition-colors">
                    <IconArrow className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
