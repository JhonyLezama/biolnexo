import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Tier } from "../types";
import { IconArrow } from "./icons";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

/* Aparición progresiva al hacer scroll */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Encabezado de sección con índice tipográfico */
export function SectionHead({
  index,
  eyebrow,
  title,
  lead,
  action,
  dark = false,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  action?: { to: string; label: string };
  dark?: boolean;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p
            className={`font-mono text-xs tracking-[0.22em] uppercase ${
              dark ? "text-aqua" : "text-primary"
            }`}
          >
            <span className={dark ? "text-aqua/60" : "text-primary/50"}>
              {index} /
            </span>{" "}
            {eyebrow}
          </p>
          <h2
            className={`font-display text-[clamp(1.65rem,6vw,1.875rem)] md:text-[clamp(1.875rem,3vw,2.6rem)] font-bold tracking-tight leading-[1.08] mt-3 ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h2>
          {lead && (
            <p
              className={`mt-4 text-base md:text-lg leading-relaxed ${
                dark ? "text-[#9db4ca]" : "text-inksoft"
              }`}
            >
              {lead}
            </p>
          )}
        </div>
        {action && (
          <Link
            to={action.to}
            className={`group inline-flex items-center gap-2 font-display font-semibold text-sm tracking-wide whitespace-nowrap ${
              dark ? "text-aqua" : "text-primary"
            }`}
          >
            {action.label}
            <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        )}
      </div>
    </Reveal>
  );
}

/* Insignia de nivel de contenido — pieza central de la trazabilidad BiolNexo */
export function TierBadge({ tier, small = false }: { tier: Tier; small?: boolean }) {
  const styles: Record<Tier, string> = {
    "Investigación publicada":
      "bg-primary/10 text-primary-deep border-primary/30",
    "Interpretación BiolNexo": "bg-bio-soft text-bio border-bio/30",
    "Divulgación científica":
      "bg-aqua-soft text-[#0a7586] border-aqua/35",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-wider ${
        small ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]"
      } ${styles[tier]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
      {tier}
    </span>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 bg-primary text-white font-display font-semibold rounded-md px-5 sm:px-6 py-3 sm:py-3.5 text-[14px] sm:text-[15px] min-h-[44px] transition-all duration-300 hover:bg-primary-deep hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:translate-y-0",
  outline:
    "inline-flex items-center justify-center gap-2 border border-line bg-white text-ink font-display font-semibold rounded-md px-5 sm:px-6 py-3 sm:py-3.5 text-[14px] sm:text-[15px] min-h-[44px] transition-all duration-300 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
  light:
    "inline-flex items-center justify-center gap-2 bg-aqua text-navy font-display font-semibold rounded-md px-5 sm:px-6 py-3 sm:py-3.5 text-[14px] sm:text-[15px] min-h-[44px] transition-all duration-300 hover:bg-[#2ec6dd] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-aqua/20 active:translate-y-0",
  ghostDark:
    "inline-flex items-center justify-center gap-2 border border-white/20 text-white font-display font-semibold rounded-md px-6 py-3.5 text-[15px] transition-all duration-300 hover:border-aqua hover:text-aqua hover:-translate-y-0.5 active:translate-y-0",
};

export function Stat({
  value,
  label,
  dark = false,
}: {
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`font-mono text-2xl md:text-[1.7rem] font-semibold tabular-nums ${
          dark ? "text-aqua" : "text-primary"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-[13px] leading-snug ${
          dark ? "text-[#8fa8bf]" : "text-muted"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
