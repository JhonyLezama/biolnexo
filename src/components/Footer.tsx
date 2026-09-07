import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IconChevron,
  IconFacebook,
  IconInstagram,
  IconTiktok,
  IconYoutube,
  LogoMark,
} from "./icons";

const colTitle =
  "font-mono text-[11px] uppercase tracking-[0.22em] text-[#7e9ab5]";
const linkCls =
  "text-[14px] text-[#c3d4e4] hover:text-aqua transition-colors duration-200";

const socials = [
  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61594219768551", Icon: IconFacebook },
  { label: "Instagram", href: "https://www.instagram.com", Icon: IconInstagram },
  { label: "YouTube", href: "https://www.youtube.com", Icon: IconYoutube },
  { label: "TikTok", href: "https://www.tiktok.com", Icon: IconTiktok },
];

const sections = [
  {
    id: "explorar",
    label: "Explorar",
    links: [
      { to: "/tema/biotecnologia", label: "Biotecnología" },
      { to: "/tema/tendencias", label: "Tendencias" },
      { to: "/tema/experimentos-caseros", label: "Experimentos caseros" },
      { to: "/software", label: "Software & Salud" },
    ],
  },
  {
    id: "plataforma",
    label: "Archivo",
    links: [
      { to: "/datos", label: "Datos científicos" },
      { to: "/investigacion", label: "Investigación" },
      { to: "/busqueda", label: "Buscador" },
      { to: "/ciencia", label: "Todas las áreas" },
    ],
  },
  {
    id: "biolnexo",
    label: "BiolNexo",
    links: [
      { to: "/sobre", label: "Sobre BiolNexo" },
      { to: "/contacto", label: "Contacto" },
      { to: "/privacidad", label: "Política de privacidad" },
    ],
  },
] as const;

export default function Footer() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    explorar: false,
    plataforma: false,
    biolnexo: false,
  });

  const toggle = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-dots-dark opacity-60 pointer-events-none" aria-hidden />
      <div
        className="absolute -top-40 right-[-10%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(15,168,192,0.10), transparent 65%)",
        }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-10 sm:pt-16 pb-8">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marca - siempre visible */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <LogoMark className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-display text-2xl font-bold tracking-tight">
                Biol<span className="text-aqua">Nexo</span>
              </span>
            </Link>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.28em] text-aqua">
              Ciencia • Tecnología • Ingeniería
            </p>
            <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-[#a9bdd0]">
              Conectamos conocimiento, datos y tecnología para comprender la
              ciencia. Una plataforma editorial y de datos pensada para crecer
              junto a la comunidad científica.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-md border border-white/15 flex items-center justify-center text-[#a9bdd0] transition-all duration-300 hover:border-aqua hover:text-aqua hover:-translate-y-0.5"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Desktop: 3 columnas fijas */}
          {sections.map((sec) => (
            <nav key={sec.id} aria-label={sec.label} className="hidden lg:block">
              <p className={colTitle}>{sec.label}</p>
              <ul className="mt-5 space-y-3">
                {sec.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Mobile: acordeones */}
        <div className="lg:hidden mt-8 -mx-4 sm:-mx-5 border-t border-white/10">
          {sections.map((sec) => {
            const isOpen = open[sec.id];
            return (
              <div key={sec.id} className="border-b border-white/10">
                <button
                  onClick={() => toggle(sec.id)}
                  aria-expanded={isOpen}
                  aria-controls={`footer-sec-${sec.id}`}
                  className="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 text-left"
                >
                  <span className={colTitle}>{sec.label}</span>
                  <span
                    className={`w-7 h-7 rounded-md border border-white/15 flex items-center justify-center text-[#7e9ab5] transition-all duration-300 shrink-0 ${isOpen ? "bg-white/10 border-aqua text-aqua" : ""}`}
                  >
                    <IconChevron
                      className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                <div
                  id={`footer-sec-${sec.id}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <ul className="px-4 sm:px-5 pb-5 space-y-3">
                      {sec.links.map((l) => (
                        <li key={l.to}>
                          <Link
                            to={l.to}
                            className={`${linkCls} block py-1`}
                            onClick={() => setOpen((p) => ({ ...p, [sec.id]: false }))}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 lg:mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-[12px] text-[#7e9ab5]">
            © 2026 BiolNexo — Ciencia • Tecnología • Ingeniería
          </p>
          <p className="font-mono text-[11px] text-[#63809c] max-w-md md:text-right">
            Sitio de demostración: el contenido ilustra la plataforma y no
            constituye asesoría científica ni médica.
          </p>
        </div>
      </div>
    </footer>
  );
}
