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
  { to: "/tema/biologia", label: "Biología" },
  { to: "/tema/bioinformatica", label: "Bioinformática" },
  { to: "/tema/tecnologia", label: "Tecnología" },
  { to: "/experimentos", label: "Experimentos" },
  { to: "/datos", label: "Datos" },
  { to: "/investigacion", label: "Investigación" },
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
        className="absolute inset-0 bg-navy/55 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
      />
      <div className="relative max-w-3xl mx-auto px-4 pt-24 md:pt-28">
        <div className="bg-white rounded-lg shadow-2xl border border-line overflow-hidden">
          <form
            className="flex items-center gap-3 px-5 py-4 border-b border-line"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) go(`/busqueda?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <IconSearch className="w-5 h-5 text-primary shrink-0" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar artículos, experimentos, datasets, investigación…"
              className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted text-[15px] font-body"
              aria-label="Término de búsqueda"
            />
            <button
              type="submit"
              className="font-mono text-[11px] uppercase tracking-wider text-primary border border-primary/30 rounded px-2.5 py-1 hover:bg-primary hover:text-white transition-colors"
            >
              Enter ↵
            </button>
          </form>

          <div className="max-h-[55vh] overflow-y-auto">
            {!results && (
              <div className="p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  Búsquedas frecuentes
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQ(s)}
                      className="px-3.5 py-1.5 rounded-full border border-line text-[13px] text-inksoft hover:border-aqua hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-[13px] text-muted leading-relaxed">
                  El buscador de BioNexo consulta artículos, experimentos,
                  datasets y publicaciones. Escribe al menos 2 caracteres para
                  ver resultados instantáneos.
                </p>
              </div>
            )}

            {results && (
              <div className="divide-y divide-line">
                {results.arts.length > 0 && (
                  <div className="p-2">
                    <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Artículos
                    </p>
                    {results.arts.map((a) => (
                      <button
                        key={a.slug}
                        onClick={() => go(`/articulo/${a.slug}`)}
                        className="w-full text-left px-4 py-2.5 rounded-md hover:bg-mist transition-colors flex items-center justify-between gap-4 group"
                      >
                        <span>
                          <span className="block font-display font-semibold text-[14.5px] text-ink group-hover:text-primary transition-colors">
                            {a.title}
                          </span>
                          <span className="block font-mono text-[11px] text-muted mt-0.5">
                            {categoryName(a.category)} · {fmtDate(a.date)}
                          </span>
                        </span>
                        <IconArrow className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
                {results.exps.length > 0 && (
                  <div className="p-2">
                    <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Experimentos
                    </p>
                    {results.exps.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => go("/experimentos")}
                        className="w-full text-left px-4 py-2.5 rounded-md hover:bg-mist transition-colors font-display font-semibold text-[14.5px] text-ink hover:text-primary"
                      >
                        {e.title}
                      </button>
                    ))}
                  </div>
                )}
                {results.sets.length > 0 && (
                  <div className="p-2">
                    <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Datasets
                    </p>
                    {results.sets.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => go("/datos")}
                        className="w-full text-left px-4 py-2.5 rounded-md hover:bg-mist transition-colors font-display font-semibold text-[14.5px] text-ink hover:text-primary"
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                )}
                {results.pubs.length > 0 && (
                  <div className="p-2">
                    <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      Investigación
                    </p>
                    {results.pubs.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => go("/investigacion")}
                        className="w-full text-left px-4 py-2.5 rounded-md hover:bg-mist transition-colors font-display font-semibold text-[14.5px] text-ink hover:text-primary"
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
                {results.arts.length +
                  results.exps.length +
                  results.sets.length +
                  results.pubs.length ===
                  0 && (
                  <p className="p-6 text-[14px] text-muted">
                    Sin resultados para «{q}». Prueba con otro término o{" "}
                    <Link
                      to="/ciencia"
                      onClick={onClose}
                      className="text-primary font-semibold underline underline-offset-4"
                    >
                      explora todas las áreas
                    </Link>
                    .
                  </p>
                )}
              </div>
            )}
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

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-white/95 backdrop-blur-md border-b border-line shadow-[0_1px_20px_rgba(11,28,44,0.06)]"
            : "bg-paper/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-[74px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="BioNexo — inicio">
            <LogoMark className="w-9 h-9 transition-transform duration-500 group-hover:rotate-[18deg]" />
            <span className="font-display text-[22px] font-bold tracking-tight text-ink">
              Bio<span className="text-primary">Nexo</span>
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
            menuOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0"
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
