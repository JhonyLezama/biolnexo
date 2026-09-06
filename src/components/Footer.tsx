import { Link } from "react-router-dom";
import {
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
  { label: "Facebook", href: "https://www.facebook.com", Icon: IconFacebook },
  { label: "Instagram", href: "https://www.instagram.com", Icon: IconInstagram },
  { label: "YouTube", href: "https://www.youtube.com", Icon: IconYoutube },
  { label: "TikTok", href: "https://www.tiktok.com", Icon: IconTiktok },
];

export default function Footer() {
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
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 group">
              <LogoMark className="w-10 h-10 transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-display text-2xl font-bold tracking-tight">
                Bio<span className="text-aqua">Nexo</span>
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

          {/* Explorar */}
          <nav aria-label="Explorar">
            <p className={colTitle}>Explorar</p>
            <ul className="mt-5 space-y-3">
              <li><Link to="/ciencia" className={linkCls}>Ciencia</Link></li>
              <li><Link to="/tema/biologia" className={linkCls}>Biología</Link></li>
              <li><Link to="/tema/bioinformatica" className={linkCls}>Bioinformática</Link></li>
              <li><Link to="/investigacion" className={linkCls}>Investigación</Link></li>
            </ul>
          </nav>

          {/* Plataforma */}
          <nav aria-label="Plataforma">
            <p className={colTitle}>Plataforma</p>
            <ul className="mt-5 space-y-3">
              <li><Link to="/experimentos" className={linkCls}>Experimentos</Link></li>
              <li><Link to="/datos" className={linkCls}>Datos científicos</Link></li>
              <li><Link to="/busqueda" className={linkCls}>Buscador</Link></li>
              <li><Link to="/tema/biotecnologia" className={linkCls}>Biotecnología</Link></li>
            </ul>
          </nav>

          {/* BioNexo */}
          <nav aria-label="BioNexo">
            <p className={colTitle}>BioNexo</p>
            <ul className="mt-5 space-y-3">
              <li><Link to="/sobre" className={linkCls}>Sobre BioNexo</Link></li>
              <li><Link to="/contacto" className={linkCls}>Contacto</Link></li>
              <li><Link to="/privacidad" className={linkCls}>Política de privacidad</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-[12px] text-[#7e9ab5]">
            © 2026 BioNexo — Ciencia • Tecnología • Ingeniería
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
