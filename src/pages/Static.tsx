import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { authors } from "../data/content";
import { Reveal, SectionHead, TierBadge, btn, usePageTitle } from "../components/ui";
import {
  IconArrow,
  IconCheck,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconTiktok,
  IconYoutube,
  LogoMark,
} from "../components/icons";

/* -------------------------------- SOBRE -------------------------------- */

export function SobrePage() {
  usePageTitle("Sobre BioNexo — Ciencia • Tecnología • Ingeniería");

  const phases = [
    {
      fase: "Fase 01",
      estado: "En curso",
      title: "Fundación editorial",
      desc: "Áreas científicas, artículos con niveles de contenido, experimentos, datasets y buscador global. La base que estás viendo.",
    },
    {
      fase: "Fase 02",
      estado: "Planificado",
      title: "CMS y sistema de autores",
      desc: "Panel administrativo para crear y editar artículos, gestionar categorías, etiquetas, referencias, experimentos y autores con roles.",
    },
    {
      fase: "Fase 03",
      estado: "Planificado",
      title: "API y datos vivos",
      desc: "API pública, autenticación, datasets propios de BioNexo Labs y visualizaciones conectadas a fuentes en tiempo real.",
    },
    {
      fase: "Fase 04",
      estado: "Visión",
      title: "Herramientas bioinformáticas",
      desc: "Integración con APIs científicas (GenBank, PDB, GBIF), análisis asistido por IA y utilidades en el navegador.",
    },
  ];

  return (
    <main className="pb-24">
      <section className="relative bg-white border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-dots [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 md:pt-40 pb-14">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Sobre BioNexo ]</p>
            <h1 className="mt-4 font-display font-bold text-4xl md:text-[3.4rem] tracking-tight text-ink leading-[1.06] max-w-3xl">
              Conectamos conocimiento, datos y tecnología para{" "}
              <span className="text-primary">comprender la ciencia</span>.
            </h1>
            <p className="mt-6 text-[16px] md:text-lg leading-relaxed text-inksoft max-w-2xl">
              BioNexo nace de una convicción simple: la biología moderna ya no se escribe solo en
              el laboratorio — se escribe también en repositorios de datos, notebooks y modelos.
              Somos una plataforma editorial y de datos que cubre biología, genética,
              bioinformática, biotecnología, IA científica, ecología e ingeniería, con una regla
              inamovible: <strong className="text-ink">las fuentes siempre a la vista</strong>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-20">
        <SectionHead
          index="01"
          eyebrow="Principios"
          title="Cómo trabajamos"
          lead="Tres compromisos que ordenan todo lo que publicamos."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              n: "01",
              t: "Niveles explícitos",
              d: "Cada contenido declara si es investigación publicada, interpretación BioNexo o divulgación. Nunca mezclamos los planos.",
            },
            {
              n: "02",
              t: "Trazabilidad",
              d: "DOI, revistas, repositorios y referencias enlazadas. Si un dato no puede verificarse, lo decimos.",
            },
            {
              n: "03",
              t: "Rigor sin solemnidad",
              d: "La ciencia puede contarse con precisión y con diseño moderno. Ni academicismo árido ni clickbait.",
            },
          ].map((p, i) => (
            <Reveal key={p.n} delay={i * 90}>
              <div className="h-full bg-white border border-line rounded-lg p-7 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/8 transition-all duration-300">
                <p className="font-mono text-[26px] font-semibold text-aqua">{p.n}</p>
                <h3 className="mt-3 font-display font-bold text-xl text-ink">{p.t}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-inksoft">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-20">
        <SectionHead
          index="02"
          eyebrow="Niveles de contenido"
          title="El sistema que sostiene la confianza"
        />
        <Reveal>
          <div className="bg-white border border-line rounded-lg p-7 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <TierBadge tier="Investigación publicada" />
              <p className="text-[14px] text-inksoft leading-relaxed">
                Estudios con metodología, resultados y DOI. El estándar más alto de evidencia.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <TierBadge tier="Interpretación BioNexo" />
              <p className="text-[14px] text-inksoft leading-relaxed">
                Análisis y opinión editorial del equipo sobre ciencia publicada, con fuentes primarias.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <TierBadge tier="Divulgación científica" />
              <p className="text-[14px] text-inksoft leading-relaxed">
                Conocimiento establecido, explicado con claridad y referencias para todo público.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-20">
        <SectionHead
          index="03"
          eyebrow="Hoja de ruta"
          title="Una plataforma pensada para crecer"
          lead="BioNexo está diseñada desde el día uno como plataforma escalable: frontend público separado del futuro panel administrativo, modelo de datos tipado y arquitectura lista para API, CMS y autenticación."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {phases.map((ph, i) => (
            <Reveal key={ph.fase} delay={i * 90}>
              <div className={`h-full rounded-lg border p-6 relative overflow-hidden ${i === 0 ? "bg-navy border-navy text-white" : "bg-white border-line"}`}>
                {i === 0 && <div className="absolute inset-0 grid-dots-dark opacity-50" aria-hidden />}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${i === 0 ? "text-aqua" : "text-primary"}`}>{ph.fase}</p>
                    <span className={`font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${i === 0 ? "border-aqua/40 text-aqua" : "border-line text-muted"}`}>
                      {ph.estado}
                    </span>
                  </div>
                  <h3 className={`mt-4 font-display font-bold text-lg leading-snug ${i === 0 ? "text-white" : "text-ink"}`}>{ph.title}</h3>
                  <p className={`mt-2 text-[13px] leading-relaxed ${i === 0 ? "text-[#9db4ca]" : "text-inksoft"}`}>{ph.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-20">
        <SectionHead index="04" eyebrow="Equipo editorial" title="Quiénes escriben BioNexo" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {authors.map((a, i) => (
            <Reveal key={a.id} delay={i * 70}>
              <div className="bg-white border border-line rounded-lg p-5 text-center hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <span className="mx-auto w-14 h-14 rounded-full bg-primary/10 text-primary font-mono font-semibold flex items-center justify-center text-lg">
                  {a.initials}
                </span>
                <p className="mt-3 font-display font-semibold text-[14.5px] text-ink">{a.name}</p>
                <p className="mt-1 font-mono text-[10.5px] text-primary">{a.role}</p>
                <p className="mt-1 text-[12px] text-muted">{a.area}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-20">
        <Reveal>
          <div className="bg-primary-deep rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute inset-0 grid-dots-dark opacity-50" aria-hidden />
            <div className="relative">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white">¿Quieres construir BioNexo con nosotros?</h2>
              <p className="mt-2 text-[14.5px] text-[#b6c9dc]">Buscamos autores, revisores y aliados institucionales.</p>
            </div>
            <Link to="/contacto" className={`${btn.light} relative shrink-0`}>
              Escríbenos <IconArrow className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ------------------------------- CONTACTO ------------------------------- */

export function ContactoPage() {
  usePageTitle("Contacto — BioNexo");
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "Colaborar con BioNexo", mensaje: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.nombre.trim().length < 2) errs.nombre = "Cuéntanos tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Ingresa un correo válido.";
    if (form.mensaje.trim().length < 20) errs.mensaje = "El mensaje necesita al menos 20 caracteres.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(`BNX-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);
    }
  };

  const field =
    "w-full bg-white border border-line rounded-md px-4 py-3 text-[14.5px] text-ink placeholder:text-muted outline-none focus:border-primary/60 focus:shadow-md transition-all";

  return (
    <main className="pb-24">
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-60" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 md:pt-36 pb-14">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-aqua">[ Contacto ]</p>
            <h1 className="mt-4 font-display font-bold text-4xl md:text-5xl tracking-tight text-white max-w-2xl leading-[1.08]">
              Hablemos de ciencia.
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-[#9db4ca] max-w-xl">
              Colaboraciones, envío de investigaciones, sugerencias de datasets, prensa o dudas:
              este es el canal directo con el equipo de BioNexo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16 grid lg:grid-cols-[1.3fr_1fr] gap-10">
        <Reveal>
          {sent ? (
            <div className="bg-white border border-bio/40 rounded-lg p-10 text-center">
              <span className="mx-auto w-14 h-14 rounded-full bg-bio text-white flex items-center justify-center">
                <IconCheck className="w-6 h-6" />
              </span>
              <h2 className="mt-5 font-display font-bold text-2xl text-ink">Mensaje enviado</h2>
              <p className="mt-2 text-[14.5px] text-inksoft">
                Gracias, {form.nombre.split(" ")[0]}. Registramos tu mensaje con la referencia{" "}
                <span className="font-mono text-primary font-semibold">{sent}</span>.
              </p>
              <p className="mt-3 font-mono text-[11.5px] text-muted">
                Formulario de demostración: no se envía ni almacena información real.
              </p>
              <button
                onClick={() => {
                  setSent(null);
                  setForm({ nombre: "", email: "", asunto: "Colaborar con BioNexo", mensaje: "" });
                }}
                className="mt-6 font-display font-semibold text-[14px] text-primary hover:text-primary-deep transition-colors"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="bg-white border border-line rounded-lg p-7 md:p-8">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="c-nombre" className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Nombre</label>
                  <input id="c-nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" className={field} />
                  {errors.nombre && <p className="mt-1.5 font-mono text-[11.5px] text-warn">{errors.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="c-email" className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Correo</label>
                  <input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com" className={field} />
                  {errors.email && <p className="mt-1.5 font-mono text-[11.5px] text-warn">{errors.email}</p>}
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="c-asunto" className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Asunto</label>
                <select id="c-asunto" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })} className={field}>
                  {["Colaborar con BioNexo", "Enviar una investigación", "Sugerir un dataset", "Proponer un experimento", "Prensa", "Otro"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="mt-5">
                <label htmlFor="c-msg" className="block font-mono text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Mensaje</label>
                <textarea id="c-msg" rows={6} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} placeholder="Cuéntanos con detalle…" className={`${field} resize-y`} />
                {errors.mensaje && <p className="mt-1.5 font-mono text-[11.5px] text-warn">{errors.mensaje}</p>}
              </div>
              <button type="submit" className={`${btn.primary} mt-6 w-full sm:w-auto`}>
                Enviar mensaje <IconArrow className="w-4 h-4" />
              </button>
            </form>
          )}
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={100}>
            <div className="bg-white border border-line rounded-lg p-6 flex items-center gap-4">
              <span className="w-11 h-11 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <IconMail className="w-5 h-5" />
              </span>
              <div>
                <p className="font-display font-semibold text-[15px] text-ink">Correo directo</p>
                <p className="font-mono text-[12.5px] text-muted">hola@bionexo.demo</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="bg-white border border-line rounded-lg p-6 flex items-center gap-4">
              <span className="w-11 h-11 rounded-md bg-bio/10 text-bio flex items-center justify-center shrink-0">
                <LogoMark className="w-6 h-6" />
              </span>
              <div>
                <p className="font-display font-semibold text-[15px] text-ink">Redes de BioNexo</p>
                <div className="mt-2 flex gap-2">
                  {[
                    { Icon: IconFacebook, href: "https://www.facebook.com", label: "Facebook" },
                    { Icon: IconInstagram, href: "https://www.instagram.com", label: "Instagram" },
                    { Icon: IconYoutube, href: "https://www.youtube.com", label: "YouTube" },
                    { Icon: IconTiktok, href: "https://www.tiktok.com", label: "TikTok" },
                  ].map(({ Icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 rounded-md border border-line flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="bg-navy rounded-lg p-6 relative overflow-hidden">
              <div className="absolute inset-0 grid-dots-dark opacity-50" aria-hidden />
              <div className="relative">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-aqua">Tiempo de respuesta</p>
                <p className="mt-2 font-display font-bold text-xl text-white">&lt; 48 horas hábiles</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#9db4ca]">
                  Equipo distribuido en Latinoamérica y Europa. Leemos todo; respondemos lo que
                  podemos con la calidad que mereces.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ PRIVACIDAD ------------------------------ */

export function PrivacidadPage() {
  usePageTitle("Política de privacidad — BioNexo");
  const sections = [
    {
      t: "Este sitio es una demostración",
      d: "BioNexo, en su estado actual, es una interfaz de demostración. Los formularios (boletín, contacto) validan datos localmente y no los envían ni almacenan en ningún servidor.",
    },
    {
      t: "Datos que no recopilamos",
      d: "No usamos cookies de seguimiento, no vendemos datos y no compartimos información con terceros. Cuando la plataforma incorpore autenticación, publicaremos una política completa y auditable.",
    },
    {
      t: "Contenido científico",
      d: "El contenido tiene fines informativos y educativos. No constituye asesoría médica, sanitaria ni profesional. Ante decisiones de salud, consulta siempre a personal calificado.",
    },
    {
      t: "Propiedad intelectual",
      d: "Los artículos de demostración se publican bajo licencia CC BY-NC 4.0. Las imágenes generativas son de demostración. Los repositorios externos enlazados conservan sus propias licencias.",
    },
  ];
  return (
    <main className="pb-24">
      <section className="relative bg-white border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-dots [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 pt-32 md:pt-36 pb-12">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Legal ]</p>
            <h1 className="mt-4 font-display font-bold text-4xl md:text-5xl tracking-tight text-ink">
              Política de privacidad
            </h1>
            <p className="mt-4 font-mono text-[12px] text-muted">Última actualización: enero de 2026</p>
          </Reveal>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-5 md:px-8 pt-12 space-y-5">
        {sections.map((s, i) => (
          <Reveal key={s.t} delay={i * 70}>
            <div className="bg-white border border-line rounded-lg p-7">
              <h2 className="font-display font-bold text-xl text-ink">{s.t}</h2>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-inksoft">{s.d}</p>
            </div>
          </Reveal>
        ))}
        <Reveal>
          <p className="text-[13.5px] text-muted">
            ¿Dudas sobre privacidad? Escríbenos vía{" "}
            <Link to="/contacto" className="text-primary font-semibold underline underline-offset-4">contacto</Link>.
          </p>
        </Reveal>
      </section>
    </main>
  );
}

/* -------------------------------- 404 -------------------------------- */

export function NotFoundPage() {
  usePageTitle("404 — Secuencia no encontrada · BioNexo");
  return (
    <main className="max-w-3xl mx-auto px-5 pt-40 pb-28 text-center">
      <Reveal>
        <p className="font-mono text-[13px] tracking-[0.2em] text-primary">
          ATG ··· <span className="text-aqua">TAA</span> · codón de parada
        </p>
        <h1 className="mt-5 font-display font-bold text-5xl md:text-6xl tracking-tight text-ink">
          Error 404
        </h1>
        <p className="mt-4 text-[16px] text-inksoft max-w-md mx-auto leading-relaxed">
          Esta secuencia no existe en el genoma de BioNexo. Puede que el enlace haya mutado o que
          la página nunca se haya expresado.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <Link to="/" className={btn.primary}>Volver al inicio</Link>
          <Link to="/ciencia" className={btn.outline}>Explorar ciencia</Link>
        </div>
      </Reveal>
    </main>
  );
}
