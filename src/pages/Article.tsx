import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { BodyBlock } from "../types";
import {
  categoryName,
  fmtDate,
  getArticle,
  getAuthor,
  relatedTo,
} from "../data/content";
import { ArticleCard } from "../components/Cards";
import { Reveal, TierBadge, usePageTitle } from "../components/ui";
import {
  IconAlert,
  IconArrow,
  IconArrowUpRight,
  IconBook,
  IconCheck,
  IconCopy,
  IconExternal,
  IconQuote,
} from "../components/icons";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };
  return { copied, copy };
}

function useReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function Block({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return <p className="my-5">{block.text}</p>;
    case "list":
      return (
        <ul>
          {block.items?.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-[3px] border-aqua pl-6 relative">
          <IconQuote className="w-6 h-6 text-aqua/50 absolute -left-[13px] -top-2 bg-paper rounded-full p-0.5" />
          <p className="font-display text-xl md:text-[1.35rem] font-medium leading-snug text-ink not-italic">
            {block.text}
          </p>
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-8">
          <img src={block.src} alt={block.caption} className="rounded-lg border border-line w-full" loading="lazy" />
          {block.caption && (
            <figcaption className="mt-2.5 font-mono text-[11.5px] text-muted">{block.caption}</figcaption>
          )}
        </figure>
      );
    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left min-w-[480px]">
            <thead>
              <tr className="bg-mist">
                {block.header?.map((h, i) => (
                  <th key={i} className="px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-primary-deep border-b border-line">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0 hover:bg-mist/50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 text-[13.5px] leading-relaxed ${j === 0 ? "font-semibold text-ink" : "text-inksoft"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "sequence":
      return (
        <div className="my-8 bg-navy rounded-lg p-5 overflow-x-auto">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#7e9ab5] mb-2.5">
            {block.label ?? "Secuencia"}
          </p>
          <p className="font-mono text-[15px] md:text-base tracking-[0.18em] text-aqua whitespace-nowrap">
            {block.text}
          </p>
        </div>
      );
    case "note":
      return (
        <aside className="my-8 flex gap-3.5 bg-warn-soft border border-warn/25 rounded-lg p-5">
          <IconAlert className="w-5 h-5 text-warn shrink-0 mt-0.5" />
          <p className="text-[13.5px] leading-relaxed text-inksoft">{block.text}</p>
        </aside>
      );
    default:
      return null;
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticle(slug ?? "");
  usePageTitle(article ? `${article.title} — BioNexo` : "Artículo no encontrado — BioNexo");
  const progress = useReadingProgress();
  const { copied: citeCopied, copy: copyCite } = useCopy();
  const { copied: linkCopied, copy: copyLink } = useCopy();

  const related = useMemo(() => (article ? relatedTo(article.slug) : []), [article]);

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto px-5 pt-40 pb-24 text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-primary">Error · slug desconocido</p>
        <h1 className="mt-4 font-display font-bold text-3xl">Este artículo no existe.</h1>
        <Link to="/ciencia" className="mt-8 inline-flex items-center gap-2 text-primary font-display font-semibold">
          Volver al explorador <IconArrow className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  const author = getAuthor(article.authorId);
  const citation = `${author.name.replace("Dra. ", "").replace("Dr. ", "").replace("Ing. ", "")} (${article.source.year}). «${article.title}». BioNexo — Ciencia • Tecnología • Ingeniería. https://doi.org/${article.source.doi}`;

  return (
    <main className="pb-24">
      {/* barra de progreso de lectura */}
      <div className="fixed top-0 left-0 right-0 z-[80] h-[3px] bg-transparent" aria-hidden>
        <div className="h-full bg-aqua transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* Encabezado del artículo */}
      <header className="relative bg-white border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-dots [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 md:pt-36 pb-10 md:pb-14">
          <Reveal>
            <nav aria-label="Ruta" className="font-mono text-[11.5px] text-muted">
              <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span className="mx-2 text-line">/</span>
              <Link to="/ciencia" className="hover:text-primary transition-colors">Ciencia</Link>
              <span className="mx-2 text-line">/</span>
              <Link to={`/tema/${article.category}`} className="hover:text-primary transition-colors">
                {categoryName(article.category)}
              </Link>
            </nav>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={`/tema/${article.category}`}
                className="font-mono text-[11px] uppercase tracking-[0.16em] bg-primary text-white px-3 py-1.5 rounded-sm hover:bg-primary-deep transition-colors"
              >
                {categoryName(article.category)}
              </Link>
              <TierBadge tier={article.tier} />
            </div>
            <h1 className="mt-5 font-display font-bold text-3xl md:text-[3.1rem] leading-[1.1] tracking-[-0.015em] text-ink max-w-4xl">
              {article.title}
            </h1>
            <p className="mt-5 text-[16.5px] md:text-lg leading-relaxed text-inksoft max-w-3xl">
              {article.excerpt}
            </p>

            {/* meta */}
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-primary text-white font-mono text-[13px] font-semibold flex items-center justify-center">
                  {author.initials}
                </span>
                <div>
                  <p className="font-display font-semibold text-[14.5px] text-ink">{author.name}</p>
                  <p className="font-mono text-[11.5px] text-muted">{author.role} · {author.area}</p>
                </div>
              </div>
              <div className="font-mono text-[12px] text-muted">
                <p>{fmtDate(article.date)}</p>
                <p className="mt-0.5 text-primary">{article.readMin} min de lectura</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <Link
                    key={t}
                    to={`/busqueda?q=${encodeURIComponent(t)}`}
                    className="font-mono text-[11px] bg-mist border border-line text-inksoft px-2.5 py-1 rounded-full hover:border-aqua hover:text-primary transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* Imagen principal */}
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="-mb-2">
          <figure className="mt-10">
            <div className="rounded-xl overflow-hidden border border-line shadow-xl shadow-navy/8">
              <img src={article.image} alt={article.imageCaption} className="w-full object-cover aspect-[21/9]" />
            </div>
            <figcaption className="mt-3 font-mono text-[11.5px] text-muted">
              Fig. 01 — {article.imageCaption} · Imagen generativa de demostración.
            </figcaption>
          </figure>
        </Reveal>

        {/* Aviso demo */}
        <Reveal>
          <aside className="mt-6 flex gap-3.5 items-start bg-aqua-soft border border-aqua/30 rounded-lg px-5 py-4">
            <IconBook className="w-5 h-5 text-[#0a7586] shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-inksoft">
              <strong className="text-[#0a7586]">Contenido de demostración.</strong>{" "}
              Este artículo ilustra el formato editorial de BioNexo y resume
              conocimiento científico establecido; no reporta resultados nuevos.
            </p>
          </aside>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-12 gap-12">
          {/* Cuerpo */}
          <article className="lg:col-span-8 article-body max-w-none">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-6">
              Resumen — {article.readMin} min
            </p>
            {article.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}

            {/* Referencias */}
            <section className="mt-16 pt-8 border-t-2 border-ink" aria-labelledby="refs-title">
              <h2 className="font-display text-xl font-bold text-ink mb-1" id="refs-title">
                Referencias
              </h2>
              <p className="font-mono text-[11.5px] text-muted mb-5">
                {article.references.length} fuentes · trazabilidad completa
              </p>
              <ol className="space-y-3">
                {article.references.map((r, i) => (
                  <li key={i} className="flex gap-3.5 text-[13.5px] leading-relaxed text-inksoft">
                    <span className="font-mono text-[12px] text-primary shrink-0 pt-0.5">[{i + 1}]</span>
                    <span>
                      {r.text}{" "}
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[12px] text-primary hover:text-primary-deep break-all"
                        >
                          {r.url.replace("https://", "")} <IconExternal className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </article>

          {/* Barra lateral */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-5">
              {/* Fuente científica */}
              <Reveal>
                <div className="bg-navy rounded-lg p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 grid-dots-dark opacity-50" aria-hidden />
                  <div className="relative">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-aqua">
                      Fuente científica
                    </p>
                    <dl className="mt-4 space-y-3 text-[13px]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7e9ab5]">Publicación</dt>
                        <dd className="font-semibold text-right">{article.source.journal}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7e9ab5]">Año</dt>
                        <dd className="font-mono">{article.source.year}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7e9ab5]">Tipo</dt>
                        <dd className="text-right text-[12.5px]">{article.source.type}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#7e9ab5]">Licencia</dt>
                        <dd className="font-mono text-aqua">{article.source.license}</dd>
                      </div>
                    </dl>
                    <a
                      href={`https://doi.org/${article.source.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center justify-between bg-navy-2 border border-white/15 rounded-md px-4 py-3 font-mono text-[12px] text-aqua hover:border-aqua transition-colors group"
                    >
                      <span className="truncate pr-2">doi:{article.source.doi}</span>
                      <IconArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <p className="mt-3 font-mono text-[10.5px]" style={{ color: "#63809c" }}>
                      DOI de demostración · formato de referencia
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Citar */}
              <Reveal delay={80}>
                <div className="bg-white border border-line rounded-lg p-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
                    Citar este artículo
                  </p>
                  <p className="mt-3 font-mono text-[12px] leading-relaxed text-inksoft bg-mist border border-line rounded-md p-3.5">
                    {citation}
                  </p>
                  <button
                    onClick={() => copyCite(citation)}
                    className={`mt-3.5 w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 font-display font-semibold text-[13.5px] transition-all ${
                      citeCopied
                        ? "bg-bio text-white border-bio"
                        : "border-line text-ink hover:border-primary hover:text-primary"
                    }`}
                  >
                    {citeCopied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                    {citeCopied ? "Cita copiada" : "Copiar cita (APA)"}
                  </button>
                  <button
                    onClick={() => copyLink(window.location.href)}
                    className={`mt-2.5 w-full inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 font-display font-semibold text-[13.5px] transition-all ${
                      linkCopied
                        ? "bg-bio text-white border-bio"
                        : "border-line text-ink hover:border-primary hover:text-primary"
                    }`}
                  >
                    {linkCopied ? <IconCheck className="w-4 h-4" /> : <IconArrowUpRight className="w-4 h-4" />}
                    {linkCopied ? "Enlace copiado" : "Compartir enlace"}
                  </button>
                </div>
              </Reveal>

              {/* Relacionados */}
              <Reveal delay={140}>
                <div className="bg-white border border-line rounded-lg p-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
                    Sigue leyendo
                  </p>
                  <div className="mt-4 space-y-4">
                    {related.slice(0, 3).map((a) => (
                      <Link key={a.slug} to={`/articulo/${a.slug}`} className="group flex gap-3.5">
                        <img
                          src={a.image}
                          alt=""
                          className="w-16 h-16 rounded-md object-cover border border-line shrink-0"
                          loading="lazy"
                        />
                        <span className="min-w-0">
                          <span className="block font-display font-semibold text-[13.5px] leading-snug text-ink group-hover:text-primary transition-colors line-clamp-2">
                            {a.title}
                          </span>
                          <span className="block font-mono text-[10.5px] text-muted mt-1.5">
                            {categoryName(a.category)} · {a.readMin} min
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>

        {/* Más artículos */}
        <section className="mt-20">
          <div className="flex items-end justify-between mb-7">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink">Más artículos</h2>
            <Link to="/ciencia" className="inline-flex items-center gap-2 font-display font-semibold text-sm text-primary group">
              Explorar todo <IconArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
