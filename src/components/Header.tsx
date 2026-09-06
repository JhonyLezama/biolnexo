import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  articles,
  categoryName,
  datasets,
  experiments,
  fmtDate,
  getAuthor,
  publications,
} from "../data/content";
import {
  IconArrow,
  IconClose,
  IconMenu,
  IconSearch,
  LogoMark,
} from "./icons";

const navLinks = [
  { to: "/", label: "Inicio", end: true },
  { to: "/ciencia", label: "Ciencia" },
  { to: "/tema/biotecnologia", label: "Biotecnología" },
  { to: "/tema/tendencias", label: "Tendencias" },
  { to: "/tema/experimentos-caseros", label: "Experimentos" },
  { to: "/software", label: "Software" },
  { to: "/datos", label: "Datos" },
];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return null;
    const match = (s: string) => s.toLowerCase().includes(term);
    return {
      arts: articles
        .filter(
          (a) =>
            match(a.title) ||
            match(a.excerpt) ||
            match(a.tags.join(" ")) ||
            match(categoryName(a.category)) ||
            match(getAuthor(a.authorId).name),
        )
        .slice(0, 5),
      exps: experiments.filter((e) => match(e.title) || match(e.area)).slice(0, 3),
      sets: datasets.filter((d) => match(d.name) || match(d.kind)).slice(0, 3),
      pubs: publications.filter((p) => match(p.title) || match(p.area)).slice(0, 3),
    };
  }, [q]);

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const suggestions = ["CRISPR", "genoma", "PCR", "proteínas", "bioinformática", "microscopía"];

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Buscador global">
      <button
        aria-label="Cerrar buscador"
        className="absolute inset-0 bg-navy/70 backdrop-blur-[12px] cursor-default"
        onClick={onClose}
      />
      <div className="relative max-w-[640px] mx-auto px-4 pt-[10vh] sm:pt-[14vh]">
        <div className="bg-white rounded-[24px] sm:rounded-[28px] shadow-[0_24px_64px_rgba(2,14,28,0.32)] border border-white/30 overflow-hidden">
          <form
            className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-line/30 bg-white rounded-t-[24px] sm:rounded-t-[28px] focus-within:border-aqua/20 transition-colors"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) go(`/busqueda?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <span className="w-9 h-9 rounded-full bg-mist text-muted flex items-center justify-center shrink-0">
              <IconSearch className="w-[18px] h-[18px]" />
            </span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar artículos, experimentos, datasets…"
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted text-[15px] sm:text-[16px] font-body min-w-0"
              aria-label="Término de búsqueda"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Limpiar"
                className="w-7 h-7 rounded-full bg-mist text-muted hover:text-ink flex items-center justify-center shrink-0 transition-colors"
              >
                <IconClose className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-1">
              <kbd className="px-2 py-1 rounded-md bg-mist border border-line font-mono text-[10px] text-muted">ESC</kbd>
              <kbd className="px-2 py-1 rounded-md bg-navy text-aqua font-mono text-[10px]">↵</kbd>
            </div>
          </form>

          <div className="relative max-h-[42vh] sm:max-h-[48vh] overflow-hidden">
            {!results && (
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Sugerencias</p>
                  <div className="h-px flex-1 bg-line/60" />
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQ(s)}
                      className="group flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-paper border border-line/60 text-[13px] text-ink font-medium hover:bg-navy hover:text-white hover:border-navy hover:shadow-md transition-all text-left"
                    >
                      <span className="w-7 h-7 rounded-lg bg-white group-hover:bg-white/15 border border-line group-hover:border-white/15 flex items-center justify-center shrink-0 transition-colors">
                        <IconSearch className="w-3.5 h-3.5 text-muted group-hover:text-white" />
                      </span>
                      <span className="truncate">{s}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-aqua-soft/60 border border-aqua/20 p-4 flex gap-3">
                  <span className="w-8 h-8 rounded-lg bg-aqua text-white flex items-center justify-center shrink-0 mt-0.5">
                    <IconSearch className="w-4 h-4" />
                  </span>
                  <p className="text-[13px] leading-relaxed text-inksoft">
                    <span className="font-semibold text-ink">Tip:</span> escribe al menos 2 caracteres. Buscamos en títulos, tags y autores al instante.
                  </p>
                </div>
              </div>
            )}

            {results && (
              <div className="divide-y divide-line/60 pb-8">
                {results.arts.length > 0 && (
                  <div className="p-2 sm:p-3">
                    <p className="px-3 pt-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Artículos · {results.arts.length}
                    </p>
                    <div className="grid gap-1">
                      {results.arts.map((a) => (
                        <button
                          key={a.slug}
                          onClick={() => go(`/articulo/${a.slug}`)}
                          className="w-full text-left px-3 py-3 rounded-xl hover:bg-mist border border-transparent hover:border-line/60 transition-all flex items-center justify-between gap-4 group"
                        >
                          <span className="min-w-0">
                            <span className="block font-display font-semibold text-[14px] sm:text-[14.5px] text-ink group-hover:text-primary transition-colors line-clamp-1">
                              {a.title}
                            </span>
                            <span className="block font-mono text-[11px] text-muted mt-1 truncate">
                              {categoryName(a.category)} · {fmtDate(a.date)}
                            </span>
                          </span>
                          <span className="w-8 h-8 rounded-lg bg-white border border-line group-hover:bg-primary group-hover:text-white group-hover:border-primary text-muted flex items-center justify-center shrink-0 transition-colors">
                            <IconArrow className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {results.exps.length > 0 && (
                  <div className="p-2 sm:p-3">
                    <p className="px-3 pt-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-bio" /> Experimentos · {results.exps.length}
                    </p>
                    <div className="grid gap-1">
                      {results.exps.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => go("/experimentos")}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-mist border border-transparent hover:border-line/60 transition-all flex items-center justify-between gap-3 group"
                        >
                          <span className="font-display font-medium text-[13.5px] sm:text-[14px] text-ink group-hover:text-primary truncate min-w-0">{e.title}</span>
                          <IconArrow className="w-3.5 h-3.5 text-muted group-hover:text-primary shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {results.sets.length > 0 && (
                  <div className="p-2 sm:p-3">
                    <p className="px-3 pt-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-aqua" /> Datasets · {results.sets.length}
                    </p>
                    <div className="grid gap-1">
                      {results.sets.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => go("/datos")}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-mist border border-transparent hover:border-line/60 transition-all flex items-center justify-between gap-3 group"
                        >
                          <span className="font-display font-medium text-[13.5px] sm:text-[14px] text-ink group-hover:text-primary truncate min-w-0">{d.name}</span>
                          <IconArrow className="w-3.5 h-3.5 text-muted group-hover:text-primary shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {results.pubs.length > 0 && (
                  <div className="p-2 sm:p-3">
                    <p className="px-3 pt-2 pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-navy" /> Investigación · {results.pubs.length}
                    </p>
                    <div className="grid gap-1">
                      {results.pubs.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => go("/investigacion")}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-mist border border-transparent hover:border-line/60 transition-all flex items-center justify-between gap-3 group"
                        >
                          <span className="font-display font-medium text-[13.5px] sm:text-[14px] text-ink group-hover:text-primary truncate min-w-0">{p.title}</span>
                          <IconArrow className="w-3.5 h-3.5 text-muted group-hover:text-primary shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {results.arts.length +
                  results.exps.length +
                  results.sets.length +
                  results.pubs.length ===
                  0 && (
                  <div className="p-8 text-center">
                    <div className="mx-auto w-10 h-10 rounded-xl bg-mist text-muted flex items-center justify-center">
                      <IconSearch className="w-5 h-5" />
                    </div>
                    <p className="mt-3 font-display font-semibold text-ink">Sin resultados para «{q}»</p>
                    <p className="mt-1 text-[13px] text-muted">Prueba con otro término o</p>
                    <Link
                      to="/ciencia"
                      onClick={onClose}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy text-white text-[13px] font-semibold hover:bg-primary transition-colors"
                    >
                      Explora áreas <IconArrow className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
            {results &&
              results.arts.length + results.exps.length + results.sets.length + results.pubs.length > 3 && (
                <div
                  className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white via-white/85 to-transparent pointer-events-none"
                  aria-hidden
                />
              )}
          </div>
          <div className="px-4 sm:px-6 py-3 bg-mist/50 border-t border-line/60 flex items-center justify-between">
            <p className="font-mono text-[11px] text-muted hidden sm:block">↵ para buscar · ESC para cerrar</p>
            <button
              onClick={() => q.trim() && go(`/busqueda?q=${encodeURIComponent(q.trim())}`)}
              className="w-full sm:w-auto font-display font-semibold text-[13px] text-primary hover:text-primary-deep flex items-center justify-center gap-1.5"
            >
              Ver todos los resultados <IconArrow className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-white/95 backdrop-blur-md border-b border-line shadow-[0_1px_20px_rgba(11,28,44,0.06)]"
            : "bg-paper/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-4 sm:px-5 md:px-8 h-16 md:h-[74px] flex items-center justify-between gap-3 sm:gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="BiolNexo — inicio">
            <LogoMark className="w-9 h-9 transition-transform duration-500 group-hover:rotate-[18deg]" />
            <span className="font-display text-[22px] font-bold tracking-tight text-ink">
              Biol<span className="text-primary">Nexo</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-[18px] xl:gap-5" aria-label="Principal">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `relative text-[13.5px] font-display font-medium tracking-wide transition-colors duration-200 py-1 after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-aqua after:transition-all after:duration-300 ${
                    isActive
                      ? "text-primary after:w-full"
                      : "text-inksoft hover:text-primary after:w-0 hover:after:w-full"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Abrir buscador"
              className="w-10 h-10 rounded-md border border-line bg-white flex items-center justify-center text-inksoft transition-all duration-300 hover:border-aqua hover:text-primary hover:-translate-y-0.5"
            >
              <IconSearch className="w-[18px] h-[18px]" />
            </button>
            <Link
              to="/ciencia"
              className="hidden xl:inline-flex items-center gap-2 bg-primary text-white font-display font-semibold text-[13.5px] rounded-md px-4.5 py-2.5 transition-all duration-300 hover:bg-primary-deep hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
              style={{ paddingLeft: "1.1rem", paddingRight: "1.1rem" }}
            >
              Explorar ciencia
              <IconArrow className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              className="lg:hidden w-10 h-10 rounded-md border border-line bg-white flex items-center justify-center text-ink"
            >
              {menuOpen ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-out ${
            menuOpen ? "max-h-[min(560px,calc(100dvh-64px))] opacity-100 overflow-y-auto scrollbar-hide" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-5 pt-2 pb-6 bg-white border-t border-line" aria-label="Móvil">
            {navLinks.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                style={{ transitionDelay: `${i * 30}ms` }}
                className={({ isActive }) =>
                  `block py-3 font-display text-lg font-semibold border-b border-line/70 transition-colors ${
                    isActive ? "text-primary" : "text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/ciencia"
              className="mt-5 flex items-center justify-center gap-2 bg-primary text-white font-display font-semibold rounded-md px-6 py-3.5"
            >
              Explorar ciencia <IconArrow className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
