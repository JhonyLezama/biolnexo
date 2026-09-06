import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import type { Article, Category, Dataset, Publication } from "../types";
import { categoryName, fmtDate, getAuthor } from "../data/content";
import { TierBadge } from "./ui";
import {
  IconArrow,
  IconArrowUpRight,
  IconChart,
  IconChip,
  IconClock,
  IconExternal,
  IconFlask,
  IconGear,
  IconHelix,
  IconLeaf,
  IconMicroscope,
  IconTerminal,
} from "./icons";

export const catIcons: Record<string, ComponentType<SVGProps<SVGSVGElement> & { className?: string }>> = {
  helix: IconHelix,
  terminal: IconTerminal,
  flask: IconFlask,
  chip: IconChip,
  microscope: IconMicroscope,
  leaf: IconLeaf,
  chart: IconChart,
  gear: IconGear,
};

const tintBg: Record<Category["tint"], string> = {
  primary: "bg-primary/10 text-primary",
  bio: "bg-bio/10 text-bio",
  aqua: "bg-aqua/12 text-[#0a7586]",
};

/* ------------------------------ Artículo ------------------------------ */

export function ArticleCard({ article }: { article: Article }) {
  const author = getAuthor(article.authorId);
  return (
    <Link
      to={`/articulo/${article.slug}`}
      className="group block bg-white border border-line rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/10 hover:border-primary/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        <img
          src={article.image}
          alt={article.imageCaption}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/55 via-transparent to-transparent opacity-70" />
        <span className="absolute top-3 left-3 bg-white/95 text-primary-deep border border-line font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm">
          {categoryName(article.category)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-[17px] leading-snug text-ink group-hover:text-primary transition-colors duration-300">
          {article.title}
        </h3>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-inksoft line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-4 pt-3.5 border-t border-line flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted">
            {fmtDate(article.date)} · {article.readMin} min
          </span>
          <span
            className="w-7 h-7 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-semibold flex items-center justify-center"
            title={author.name}
          >
            {author.initials}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* Artículo destacado horizontal */
export function FeaturedCard({ article }: { article: Article }) {
  const author = getAuthor(article.authorId);
  return (
    <Link
      to={`/articulo/${article.slug}`}
      className="group grid md:grid-cols-[1.15fr_1fr] bg-navy rounded-xl overflow-hidden border border-navy-2 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy/30"
    >
      <div className="relative min-h-[240px] md:min-h-full overflow-hidden">
        <img
          src={article.image}
          alt={article.imageCaption}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/30" />
      </div>
      <div className="p-7 md:p-9 flex flex-col">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-aqua/15 text-aqua border border-aqua/30 font-mono text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-sm">
            {categoryName(article.category)}
          </span>
          <TierBadge tier={article.tier} small />
        </div>
        <h3 className="mt-4 font-display font-bold text-2xl md:text-[1.85rem] leading-tight text-white group-hover:text-aqua transition-colors duration-300">
          {article.title}
        </h3>
        <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#9db4ca] line-clamp-3">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-aqua/15 border border-aqua/30 text-aqua font-mono text-[11px] font-semibold flex items-center justify-center">
              {author.initials}
            </span>
            <div>
              <p className="text-[13px] font-semibold text-white">{author.name}</p>
              <p className="font-mono text-[11px] text-[#7e9ab5]">
                {fmtDate(article.date)} · {article.readMin} min de lectura
              </p>
            </div>
          </div>
          <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-aqua transition-all duration-300 group-hover:bg-aqua group-hover:text-navy group-hover:border-aqua shrink-0">
            <IconArrow className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------ Categoría ------------------------------ */

export function CategoryCard({
  category,
  count,
  className = "",
}: {
  category: Category;
  count: number;
  className?: string;
}) {
  const Icon = catIcons[category.icon] ?? IconHelix;
  return (
    <Link
      to={`/tema/${category.slug}`}
      className={`group relative bg-white border border-line rounded-lg p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-navy/8 ${className}`}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(15,168,192,0.14), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="flex items-start justify-between">
        <span className={`w-12 h-12 rounded-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${tintBg[category.tint]}`}>
          <Icon className="w-6 h-6" />
        </span>
        <span className="font-mono text-[11px] text-muted">{count} art.</span>
      </div>
      <div>
        <h3 className="font-display font-bold text-lg text-ink group-hover:text-primary transition-colors duration-300">
          {category.name}
        </h3>
        <p className="mt-1 font-mono text-[11.5px] text-muted">{category.tagline}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-display font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        Explorar <IconArrow className="w-3.5 h-3.5" />
      </span>
    </Link>
  );
}

/* ------------------------------ Dataset ------------------------------ */

function Sparkline({ values, tone = "aqua" }: { values: number[]; tone?: "aqua" | "bio" }) {
  const w = 110;
  const h = 32;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * w).toFixed(1)},${(
          h - 3 - ((v - min) / (max - min || 1)) * (h - 8)
        ).toFixed(1)}`,
    )
    .join(" ");
  const color = tone === "aqua" ? "#0FA8C0" : "#0E8F5F";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-[110px] h-8" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle
        cx={w}
        cy={h - 3 - ((values[values.length - 1] - min) / (max - min || 1)) * (h - 8)}
        r="2.6"
        fill={color}
      />
    </svg>
  );
}

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <article className="group bg-white border border-line rounded-lg p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-navy/8">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0a7586] bg-aqua-soft border border-aqua/30 px-2 py-0.5 rounded-sm">
          {dataset.kind}
        </span>
        {dataset.demo ? (
          <span className="font-mono text-[10px] uppercase tracking-wider text-warn bg-warn-soft border border-warn/25 px-2 py-0.5 rounded-sm">
            Demo
          </span>
        ) : (
          <Sparkline values={dataset.spark} />
        )}
      </div>
      <h3 className="mt-3.5 font-display font-bold text-[17px] text-ink group-hover:text-primary transition-colors">
        {dataset.name}
      </h3>
      <p className="font-mono text-[11px] text-muted mt-0.5">{dataset.org}</p>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-inksoft">{dataset.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {dataset.formats.map((f) => (
          <span key={f} className="font-mono text-[10.5px] bg-mist text-inksoft px-2 py-0.5 rounded-sm border border-line">
            {f}
          </span>
        ))}
        <span className="font-mono text-[10.5px] text-muted px-1 py-0.5">{dataset.license}</span>
      </div>
      <div className="mt-5 pt-4 border-t border-line flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted">{dataset.records}</span>
        {dataset.url ? (
          <a
            href={dataset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-display font-semibold text-primary hover:text-primary-deep transition-colors"
          >
            Visitar <IconExternal className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            to="/datos"
            className="inline-flex items-center gap-1.5 text-[13px] font-display font-semibold text-primary hover:text-primary-deep transition-colors"
          >
            Ver en Datos <IconArrow className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
}

/* ---------------------------- Publicación ----------------------------- */

export function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <article className="group bg-white border border-line rounded-lg p-6 md:p-7 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-navy/8 hover:-translate-y-1">
      <div className="flex flex-wrap items-center gap-2.5">
        <TierBadge tier="Investigación publicada" small />
        <span className="font-mono text-[11px] text-muted">{pub.area}</span>
        <span className="font-mono text-[11px] text-muted">· {pub.year}</span>
      </div>
      <h3 className="mt-3 font-display font-bold text-lg md:text-xl leading-snug text-ink group-hover:text-primary transition-colors">
        {pub.title}
      </h3>
      <p className="mt-1.5 font-mono text-[12px] text-inksoft">
        {pub.authors.join(", ")} — <em className="not-italic text-muted">{pub.journal}</em>
      </p>
      <dl className="mt-4 grid gap-2.5 text-[13.5px]">
        <div className="flex gap-2.5">
          <dt className="font-mono text-[10.5px] uppercase tracking-wider text-primary shrink-0 w-[92px] pt-0.5">Pregunta</dt>
          <dd className="text-inksoft leading-relaxed">{pub.question}</dd>
        </div>
        <div className="flex gap-2.5">
          <dt className="font-mono text-[10.5px] uppercase tracking-wider text-primary shrink-0 w-[92px] pt-0.5">Método</dt>
          <dd className="text-inksoft leading-relaxed">{pub.methodology}</dd>
        </div>
      </dl>
      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <a
          href={`https://doi.org/${pub.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11.5px] text-primary bg-primary/6 border border-primary/20 px-2.5 py-1 rounded-sm hover:bg-primary hover:text-white transition-colors inline-flex items-center gap-1.5"
        >
          DOI: {pub.doi} <IconArrowUpRight className="w-3 h-3" />
        </a>
        <span className="font-mono text-[11px] text-muted">{pub.references} referencias</span>
      </div>
    </article>
  );
}
