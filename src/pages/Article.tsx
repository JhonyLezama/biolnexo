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
  IconFacebook,
  IconInstagram,
  IconLinkedin,
  IconQuote,
  IconShare,
  IconTiktok,
  IconWhatsapp,
  IconX,
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

function ShareButtons({ title, url, size = "md" }: { title: string; url: string; size?: "sm" | "md" }) {
  const encTitle = encodeURIComponent(title);
  const encUrl = encodeURIComponent(url);
  const encText = encodeURIComponent(`${title} — BiolNexo\n${url}`);

  const items = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`,
      Icon: IconX,
      bg: "hover:bg-[#0f1419] hover:text-white hover:border-[#0f1419] bg-white text-ink border-line",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      Icon: IconFacebook,
      bg: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] bg-white text-[#1877F2] border-line",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      Icon: IconLinkedin,
      bg: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] bg-white text-[#0A66C2] border-line",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encText}`,
      Icon: IconWhatsapp,
      bg: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366] bg-white text-[#25D366] border-line",
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {}
    } else {
      window.open(items[0].href, "_blank", "noopener,noreferrer");
    }
  };

  const [copiedIG, setCopiedIG] = useState(false);
  const [copiedTT, setCopiedTT] = useState(false);

  const copyForSocial = async (network: "instagram" | "tiktok") => {
    const text = `${title} — BiolNexo\n${url}\n#BiolNexo #Biotecnologia`;
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
    if (network === "instagram") {
      setCopiedIG(true);
      setTimeout(() => setCopiedIG(false), 2000);
    } else {
      setCopiedTT(true);
      setTimeout(() => setCopiedTT(false), 2000);
    }
  };

  const btnCls =
    size === "sm"
      ? "w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0"
      : "w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-200 shrink-0";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map(({ label, href, Icon, bg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir en ${label}`}
          title={`Compartir en ${label}`}
          className={`${btnCls} ${bg}`}
        >
          <Icon className={size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]"} />
        </a>
      ))}
      <button
        onClick={() => copyForSocial("instagram")}
        aria-label="Copiar para Instagram"
        title={copiedIG ? "¡Copiado!" : "Copiar para Instagram"}
        className={`${btnCls} ${copiedIG ? "bg-bio text-white border-bio" : "bg-white text-[#E1306C] border-line hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]"}`}
      >
        <IconInstagram className={size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]"} />
      </button>
      <button
        onClick={() => copyForSocial("tiktok")}
        aria-label="Copiar para TikTok"
        title={copiedTT ? "¡Copiado!" : "Copiar para TikTok"}
        className={`${btnCls} ${copiedTT ? "bg-bio text-white border-bio" : "bg-white text-ink border-line hover:bg-black hover:text-white hover:border-black"}`}
      >
        <IconTiktok className={size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]"} />
      </button>
      {typeof navigator !== "undefined" && typeof (navigator as unknown as { share?: (data: ShareData) => Promise<void> }).share === "function" ? (
        <button
          onClick={handleNativeShare}
          aria-label="Compartir"
          title="Compartir"
          className={`${btnCls} bg-navy text-white border-navy hover:bg-navy-2`}
        >
          <IconShare className={size === "sm" ? "w-4 h-4" : "w-[18px] h-[18px]"} />
        </button>
      ) : null}
    </div>
  );
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
        <div className="my-8 overflow-x-auto scrollbar-hide rounded-lg border border-line -mx-4 sm:mx-0">
          <table className="w-full text-left min-w-[460px] sm:min-w-[480px]">
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
        <div className="my-8 bg-navy rounded-lg p-4 sm:p-5 overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#7e9ab5] mb-2.5">
            {block.label ?? "Secuencia"} <span className="sm:hidden text-aqua normal-case tracking-normal">› desliza</span>
          </p>
          <p className="font-mono text-[13px] sm:text-[15px] md:text-base tracking-[0.14em] sm:tracking-[0.18em] text-aqua whitespace-nowrap">
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
  usePageTitle(article ? `${article.title} — BiolNexo` : "Artículo no encontrado — BiolNexo");
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
  const citation = `${author.name.replace("Dra. ", "").replace("Dr. ", "").replace("Ing. ", "")} (${article.source.year}). «${article.title}». BiolNexo — Ciencia • Tecnología • Ingeniería. https://doi.org/${article.source.doi}`;

  return (
    <main className="pb-24">
      {/* barra de progreso de lectura */}
      <div className="fixed top-0 left-0 right-0 z-[80] h-[3px] bg-transparent" aria-hidden>
        <div className="h-full bg-aqua transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* Encabezado del artículo */}
      <header className="relative bg-white border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-dots [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-4 sm:px-5 md:px-8 pt-28 sm:pt-32 md:pt-36 pb-10 md:pb-14">
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
            <h1 className="mt-5 font-display font-bold text-[clamp(1.7rem,7vw,1.875rem)] md:text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.1] tracking-[-0.015em] text-ink max-w-4xl">
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
            {/* Compartir inline header */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-line/60">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted flex items-center gap-1.5">
                <IconShare className="w-3.5 h-3.5" /> Compartir
              </span>
              <ShareButtons title={article.title} url={typeof window !== "undefined" ? window.location.href : `https://biolnexo.demo/articulo/${article.slug}`} size="sm" />
            </div>
          </Reveal>
        </div>
      </header>

      {/* Imagen principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-5 md:px-8">
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
              Este artículo ilustra el formato editorial de BiolNexo y resume
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

            {/* Compartir al cierre del artículo */}
            <div className="mt-10 p-5 sm:p-6 bg-white border border-line rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-display font-semibold text-ink flex items-center gap-2">
                  <IconShare className="w-4 h-4 text-primary" /> ¿Te resultó útil?
                </p>
                <p className="font-mono text-[11px] text-muted mt-1">Compártelo en tus redes</p>
              </div>
              <ShareButtons title={article.title} url={typeof window !== "undefined" ? window.location.href : `https://biolnexo.demo/articulo/${article.slug}`} />
            </div>
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
                    {linkCopied ? "Enlace copiado" : "Copiar enlace"}
                  </button>
                </div>
              </Reveal>

              {/* Compartir en redes */}
              <Reveal delay={110}>
                <div className="bg-white border border-line rounded-lg p-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted flex items-center gap-2">
                    <IconShare className="w-3.5 h-3.5" /> Compartir en redes
                  </p>
                  <p className="mt-2 text-[13px] text-inksoft leading-relaxed">Difunde este artículo en tu comunidad.</p>
                  <div className="mt-4">
                    <ShareButtons title={article.title} url={typeof window !== "undefined" ? window.location.href : `https://biolnexo.demo/articulo/${article.slug}`} />
                  </div>
                  <p className="mt-3 font-mono text-[11px] text-muted">Al compartir, se incluye el enlace directo al artículo.</p>
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
