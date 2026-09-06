import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  articles,
  categoryName,
  datasets,
  experiments,
  getAuthor,
  publications,
} from "../data/content";
import { ArticleCard } from "../components/Cards";
import { Reveal, TierBadge, usePageTitle } from "../components/ui";
import { IconArrow, IconSearch } from "../components/icons";

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
  usePageTitle("Buscador — BioNexo");
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [types, setTypes] = useState<TypeFilter[]>([...typeFilters]);

  useEffect(() => {
    setQ(params.get("q") ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const term = q.trim().toLowerCase();

  const toggleType = (t: TypeFilter) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const results = useMemo(() => {
    if (term.length < 2) return null;
    const m = (s: string) => s.toLowerCase().includes(term);
    return {
      arts: articles.filter(
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
  }, [term]);

  const submit = () => {
    if (q.trim()) setParams({ q: q.trim() });
    else setParams({});
  };

  const total = results
    ? results.arts.length + results.exps.length + results.sets.length + results.pubs.length
    : 0;

  const popular = ["CRISPR", "genoma", "PCR", "proteínas", "microscopía", "datasets", "filogenia"];

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 pt-32 md:pt-36 pb-24">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">
          [ Buscador científico ]
        </p>
        <h1 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight text-ink max-w-2xl leading-[1.08]">
          Busca en todo el conocimiento de la plataforma.
        </h1>
        <form
          className="mt-8 max-w-2xl flex items-center gap-3 bg-white border border-line rounded-lg px-5 py-2 shadow-sm focus-within:border-primary/60 focus-within:shadow-md transition-all"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <IconSearch className="w-5 h-5 text-primary shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Palabras clave, tema, autor, etiqueta…"
            className="flex-1 bg-transparent py-3 outline-none text-[15.5px] text-ink placeholder:text-muted"
            aria-label="Buscar"
          />
          <button
            type="submit"
            className="bg-primary text-white font-display font-semibold text-[13.5px] rounded-md px-5 py-2.5 hover:bg-primary-deep transition-colors"
          >
            Buscar
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {popular.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQ(s);
                setParams({ q: s });
              }}
              className="px-3.5 py-1.5 rounded-full border border-line bg-white text-[13px] text-inksoft hover:border-aqua hover:text-primary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Filtros por tipo */}
      <div className="mt-10 flex flex-wrap gap-2.5" role="group" aria-label="Filtrar por tipo de contenido">
        {typeFilters.map((t) => (
          <button
            key={t}
            onClick={() => toggleType(t)}
            aria-pressed={types.includes(t)}
            className={`px-4 py-2 rounded-md border font-mono text-[11.5px] uppercase tracking-wider transition-all ${
              types.includes(t)
                ? "bg-navy text-aqua border-navy shadow-md"
                : "bg-white text-muted border-line hover:border-primary/40"
            }`}
          >
            {t}
            {results && (
              <span className="ml-2 opacity-70">
                {t === "Artículos" && results.arts.length}
                {t === "Experimentos" && results.exps.length}
                {t === "Datasets" && results.sets.length}
                {t === "Investigación" && results.pubs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!results && (
          <div className="bg-white border border-dashed border-line rounded-lg p-14 text-center">
            <p className="font-mono text-[13px] text-primary">query.length &lt; 2</p>
            <p className="mt-3 font-display font-bold text-xl text-ink">
              Escribe al menos 2 caracteres para buscar
            </p>
            <p className="mt-2 text-[14px] text-inksoft max-w-md mx-auto">
              El buscador consulta títulos, resúmenes, etiquetas, áreas y
              autores en artículos, experimentos, datasets y publicaciones.
            </p>
          </div>
        )}

        {results && total === 0 && (
          <div className="bg-white border border-dashed border-line rounded-lg p-14 text-center">
            <p className="font-mono text-[13px] text-primary">0 resultados</p>
            <p className="mt-3 font-display font-bold text-xl text-ink">
              Nada encontrado para «{q.trim()}»
            </p>
            <p className="mt-2 text-[14px] text-inksoft">
              Prueba con sinónimos o términos más generales, como los sugeridos arriba.
            </p>
          </div>
        )}

        {results && results.arts.length > 0 && types.includes("Artículos") && (
          <section className="mb-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              Artículos · {results.arts.length}
            </h2>
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              Experimentos · {results.exps.length}
            </h2>
            <div className="space-y-3">
              {results.exps.map((e) => (
                <Link
                  key={e.id}
                  to="/experimentos"
                  className="group flex items-center justify-between gap-4 bg-white border border-line rounded-lg px-5 py-4 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-display font-semibold text-[15.5px] text-ink group-hover:text-primary transition-colors">
                      <Hl text={e.title} q={q} />
                    </p>
                    <p className="font-mono text-[11.5px] text-muted mt-1">
                      {e.level} · {e.area} · {e.duration}
                    </p>
                  </div>
                  <IconArrow className="w-4 h-4 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {results && results.sets.length > 0 && types.includes("Datasets") && (
          <section className="mb-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              Datasets · {results.sets.length}
            </h2>
            <div className="space-y-3">
              {results.sets.map((d) => (
                <Link
                  key={d.id}
                  to="/datos"
                  className="group flex items-center justify-between gap-4 bg-white border border-line rounded-lg px-5 py-4 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-display font-semibold text-[15.5px] text-ink group-hover:text-primary transition-colors">
                      <Hl text={d.name} q={q} />
                    </p>
                    <p className="font-mono text-[11.5px] text-muted mt-1">
                      {d.org} · {d.records}
                    </p>
                  </div>
                  <IconArrow className="w-4 h-4 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {results && results.pubs.length > 0 && types.includes("Investigación") && (
          <section className="mb-12">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-5">
              Investigación · {results.pubs.length}
            </h2>
            <div className="space-y-3">
              {results.pubs.map((p) => (
                <Link
                  key={p.id}
                  to="/investigacion"
                  className="group flex items-center justify-between gap-4 bg-white border border-line rounded-lg px-5 py-4 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-display font-semibold text-[15.5px] text-ink group-hover:text-primary transition-colors">
                      <Hl text={p.title} q={q} />
                    </p>
                    <p className="font-mono text-[11.5px] text-muted mt-1">
                      {p.authors.join(", ")} · {p.year} · <TierBadge tier="Investigación publicada" small />
                    </p>
                  </div>
                  <IconArrow className="w-4 h-4 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
