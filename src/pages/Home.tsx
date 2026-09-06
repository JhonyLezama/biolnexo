import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  articles,
  articlesByCategory,
  bioTools,
  categories,
  categoryName,
  datasets,
  experiments,
  fmtDate,
  publications,
  genomicGrowth,
  sequencingCost,
  softwareProjects,
  tickerItems,
} from "../data/content";
import HeroViz from "../components/HeroViz";
import {
  ArticleCard,
  CategoryCard,
  DatasetCard,
  FeaturedCard,
  PublicationCard,
  SoftwareCard,
  catIcons,
} from "../components/Cards";
import {
  AlignmentViz,
  ConsoleFrame,
  CostChart,
  GrowthArea,
  PhyloTree,
} from "../components/Viz";
import { Reveal, SectionHead, Stat, TierBadge, btn, usePageTitle } from "../components/ui";
import {
  IconArrow,
  IconCheck,
  IconFlask,
  IconShield,
} from "../components/icons";

const bioTopics = [
  "ADN",
  "Secuencias",
  "Proteínas",
  "Genomas",
  "Alineamientos",
  "Filogenia",
  "Estructuras",
  "Análisis computacional",
];

const levelStyles: Record<string, string> = {
  Educativo: "bg-bio-soft text-bio border-bio/30",
  Supervisado: "bg-warn-soft text-warn border-warn/30",
  "Protocolo de investigación": "bg-primary/10 text-primary-deep border-primary/30",
};

function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="bg-navy border-y border-white/10 overflow-hidden" aria-hidden>
      <div className="ticker-track flex w-max items-center gap-10 py-3 px-5">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 shrink-0">
            <span className="font-mono text-[12px] tracking-wide text-[#7fd4e4]">{t}</span>
            <span className="text-aqua/50 text-[10px]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  usePageTitle("BiolNexo — Ciencia • Tecnología • Ingeniería");
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const latest = articles.slice(1, 7);
  const bioArts = [
    ...articlesByCategory("bioinformatica"),
    articles.find((a) => a.slug === "ia-transforma-biologia")!,
  ].slice(0, 3);

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Ingresa un correo válido para continuar.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="absolute inset-0 grid-dots [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" aria-hidden />
        <div className="absolute inset-0 wash-blue" aria-hidden />
        <div className="absolute inset-0 wash-aqua" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-4 sm:px-5 md:px-8 grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="inline-flex items-center gap-3 font-mono text-[11px] md:text-xs uppercase tracking-[0.24em] text-primary">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-bio opacity-60 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-bio" />
                </span>
                [ Plataforma científica ]<span className="caret-blink text-aqua">_</span>
              </p>
              <h1 className="mt-5 font-display font-bold text-[clamp(2rem,7vw,2.5rem)] leading-[1.05] md:text-[clamp(2.5rem,4vw,3.6rem)] tracking-[-0.02em] text-ink">
                La ciencia que{" "}
                <span className="relative inline-block text-primary">
                  conecta
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[10px] text-aqua"
                    viewBox="0 0 220 10"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path d="M3 7c60-5 150-5 214-2" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                el conocimiento con el futuro.
              </h1>
              <p className="mt-6 text-[16px] md:text-lg leading-relaxed text-inksoft max-w-xl">
                Explora biología, bioinformática, tecnología, inteligencia
                artificial, investigación y los descubrimientos que están
                transformando nuestra comprensión del mundo.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link to="/ciencia" className={btn.primary}>
                  Explorar artículos <IconArrow className="w-4 h-4" />
                </Link>
                <Link to="/investigacion" className={btn.outline}>
                  Descubrir investigaciones
                </Link>
              </div>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-line pt-7">
                <Stat value="08" label="áreas científicas" />
                <Stat value="12" label="artículos publicados" />
                <Stat value="05" label="protocolos y experimentos" />
                <Stat value="06" label="datasets referenciados" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={200}>
              <HeroViz />
            </Reveal>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ============ LO MÁS RECIENTE ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-20 md:py-28">
        <SectionHead
          index="01"
          eyebrow="Destacados"
          title="Lo más reciente"
          lead="Artículos de divulgación, análisis e interpretación editorial sobre biología, genómica, IA y tecnología — cada uno con sus fuentes a la vista."
          action={{ to: "/ciencia", label: "Ver todos los artículos" }}
        />
        <Reveal>
          <FeaturedCard article={featured} />
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 100}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CATEGORÍAS ============ */}
      <section className="bg-white border-y border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-20 md:py-28">
          <SectionHead
            index="02"
            eyebrow="Áreas"
            title="Explora la plataforma por área"
            lead="Ocho áreas interconectadas: del genoma al ecosistema, del microscopio al cluster de cómputo."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.slice(0, 4).map((c, i) => {
              const Icon = catIcons[c.icon];
              const big = i === 0;
              return (
                <Reveal
                  key={c.slug}
                  delay={i * 80}
                  className={big ? "sm:col-span-2" : ""}
                >
                  {big ? (
                    <Link
                      to={`/tema/${c.slug}`}
                      className="group relative bg-navy rounded-lg p-8 flex flex-col justify-between min-h-[280px] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-navy/25 h-full"
                    >
                      <div className="absolute inset-0 grid-dots-dark opacity-70" aria-hidden />
                      <div className="relative">
                        <span className="inline-flex w-12 h-12 rounded-md bg-aqua/15 border border-aqua/30 text-aqua items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </span>
                        <h3 className="mt-5 font-display font-bold text-2xl text-white group-hover:text-aqua transition-colors">
                          {c.name}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-[#9db4ca] max-w-sm">
                          {c.description}
                        </p>
                      </div>
                      <span className="relative mt-8 inline-flex items-center gap-2 font-display font-semibold text-aqua">
                        Explorar área <IconArrow className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </Link>
                  ) : (
                    <CategoryCard category={c} count={articlesByCategory(c.slug).length} className="h-full" />
                  )}
                </Reveal>
              );
            })}
            {categories.slice(4).map((c, i) => (
              <Reveal key={c.slug} delay={i * 80} className={i === 1 ? "sm:col-span-2 lg:col-span-1" : ""}>
                <CategoryCard category={c} count={articlesByCategory(c.slug).length} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BIOINFORMÁTICA ============ */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-50" aria-hidden />
        <div
          className="absolute -bottom-40 left-[-10%] w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(14,143,95,0.12), transparent 65%)" }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-16 sm:py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-start min-w-0">
            <div className="min-w-0">
              <SectionHead
                dark
                index="03"
                eyebrow="Bioinformática"
                title="Cuando la biología se encuentra con los datos."
                lead="Secuencias, genomas, alineamientos y árboles filogenéticos: la capa computacional donde la biología se vuelve analizable, comparable y reproducible."
              />
              <Reveal delay={100}>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {bioTopics.map((t) => (
                    <span key={t} className="font-mono text-[11px] sm:text-[11.5px] text-[#9db4ca] border border-white/15 rounded-full px-3 sm:px-3.5 py-1.5 text-center hover:border-aqua hover:text-aqua transition-colors cursor-default break-words">
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-8">
                  {bioArts.map((a, i) => (
                    <Link
                      key={a.slug}
                      to={`/articulo/${a.slug}`}
                      className="group grid grid-cols-[28px_1fr_16px] sm:flex sm:items-center gap-3 sm:gap-5 py-3 sm:py-4 border-b border-white/10 hover:bg-white/[0.04] px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-md transition-colors duration-200 min-w-0"
                    >
                      <span className="font-mono text-[12px] text-aqua/70 shrink-0 self-center">
                        0{i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display font-semibold text-[14px] sm:text-[15.5px] text-white leading-snug group-hover:text-aqua transition-colors line-clamp-2 sm:truncate">
                          {a.title}
                        </span>
                        <span className="block font-mono text-[10px] sm:text-[11px] text-[#7e9ab5] mt-1 break-words">
                          {categoryName(a.category)} · {fmtDate(a.date)} · {a.readMin} min
                        </span>
                      </span>
                      <IconArrow className="w-4 h-4 text-aqua shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 self-center hidden sm:block" />
                    </Link>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={260}>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link to="/tema/bioinformatica" className={btn.light}>
                    Entrar al área <IconArrow className="w-4 h-4" />
                  </Link>
                  <div className="flex flex-wrap gap-1.5">
                    {bioTools.slice(0, 6).map((t) => (
                      <span key={t} className="font-mono text-[10.5px] text-aqua/90 bg-aqua/10 border border-aqua/25 rounded-sm px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-5 sm:gap-6 min-w-0">
              <Reveal delay={120} className="min-w-0">
                <ConsoleFrame title="biolnexo://alineamiento · COI.fasta">
                  <AlignmentViz />
                </ConsoleFrame>
              </Reveal>
              <Reveal delay={220} className="min-w-0">
                <ConsoleFrame title="biolnexo://filogenia · arbol_modelo.nwk">
                  <PhyloTree />
                </ConsoleFrame>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXPERIMENTOS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-20 md:py-28">
        <SectionHead
          index="04"
          eyebrow="Experimentos"
          title="Ciencia en el laboratorio"
          lead="Protocolos educativos y de investigación con objetivo, materiales, procedimiento, resultados y advertencias de seguridad — siempre distinguibles por su nivel."
          action={{ to: "/experimentos", label: "Ver todos los protocolos" }}
        />
        <Reveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-3xl">
            <div className="flex gap-3.5 bg-white border border-line rounded-lg p-4">
              <span className="w-9 h-9 rounded-md bg-bio-soft text-bio flex items-center justify-center shrink-0">
                <IconShield className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </span>
              <p className="text-[13px] leading-relaxed text-inksoft">
                <strong className="text-bio font-semibold">Experimentos educativos</strong>{" "}
                — seguros para aula o casa, con supervisión recomendada.
              </p>
            </div>
            <div className="flex gap-3.5 bg-white border border-line rounded-lg p-4">
              <span className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <IconFlask className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              </span>
              <p className="text-[13px] leading-relaxed text-inksoft">
                <strong className="text-primary font-semibold">Protocolos de investigación</strong>{" "}
                — requieren laboratorio, reactivos de grado molecular y personal capacitado.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {experiments.slice(0, 3).map((ex, i) => (
            <Reveal key={ex.id} delay={i * 100}>
              <Link
                to="/experimentos"
                className="group h-full bg-white border border-line rounded-lg p-6 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-navy/8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm border ${levelStyles[ex.level]}`}>
                    {ex.level}
                  </span>
                  <span className="font-mono text-[11px] text-muted">{ex.duration}</span>
                </div>
                <h3 className="mt-4 font-display font-bold text-[17px] leading-snug text-ink group-hover:text-primary transition-colors">
                  {ex.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-inksoft line-clamp-3">
                  {ex.objective}
                </p>
                <div className="mt-auto pt-5 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted">
                    {ex.area} · dificultad {ex.difficulty.toLowerCase()}
                  </span>
                  <IconArrow className="w-4 h-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ DATOS ============ */}
      <section className="bg-white border-y border-line overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-20 md:py-28">
          <SectionHead
            index="05"
            eyebrow="Datos"
            title="Datos científicos"
            lead="Conjuntos de datos biológicos, visualizaciones interactivas y estadísticas: la materia prima de la ciencia moderna, con repositorios reales y datos de demostración claramente etiquetados."
            action={{ to: "/datos", label: "Explorar datasets" }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start min-w-0">
            {/* Gráficas - grid anidado */}
            <div className="lg:col-span-7 xl:col-span-8 grid gap-6 min-w-0">
              <Reveal className="min-w-0">
                <ConsoleFrame title="costo_genoma.log — tendencia histórica (ilustrativa, basada en NHGRI)">
                  <CostChart data={sequencingCost} />
                </ConsoleFrame>
              </Reveal>
              <Reveal className="min-w-0" delay={120}>
                <ConsoleFrame title="datos_genomicos.csv — volumen público estimado">
                  <GrowthArea data={genomicGrowth} />
                </ConsoleFrame>
              </Reveal>
            </div>
            {/* Datasets - grid */}
            <div className="lg:col-span-5 xl:col-span-4 grid gap-4 content-start min-w-0">
              <div className="grid gap-4">
                {datasets.slice(0, 4).map((d, i) => (
                  <Reveal key={d.id} delay={i * 90} className="min-w-0">
                    <Link
                      to="/datos"
                      className="group grid grid-cols-[40px_1fr_16px] items-center gap-3 sm:gap-4 bg-paper border border-line rounded-lg p-4 transition-all duration-300 hover:border-primary/40 hover:bg-white hover:shadow-md min-w-0"
                    >
                      <span className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center font-mono text-[11px] font-semibold shrink-0">
                        {d.formats[0]}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display font-semibold text-[14px] sm:text-[15px] text-ink group-hover:text-primary transition-colors truncate">
                          {d.name}
                        </span>
                        <span className="block font-mono text-[11px] text-muted truncate">
                          {d.org} · {d.records}
                        </span>
                      </span>
                      <IconArrow className="w-4 h-4 text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={380} className="min-w-0">
                <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                    Próximamente
                  </p>
                  <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-inksoft break-words">
                    Visualizaciones interactivas conectadas a APIs científicas
                    (GenBank, GBIF, PDB) y datasets propios de BiolNexo Labs.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOFTWARE & SALUD ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-20 md:py-28">
        <SectionHead
          index="05b"
          eyebrow="Software"
          title="Programas que miden tu salud"
          lead="Herramientas propias de BiolNexo: con captura o video, y links de descarga y repositorio. Hechas para compartir en clase y redes."
          action={{ to: "/software", label: "Ver todo el software" }}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {softwareProjects.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <SoftwareCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ INVESTIGACIÓN ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-20 md:py-28">
        <SectionHead
          index="06"
          eyebrow="Investigación"
          title="Investigación científica"
          lead="Publicaciones con pregunta, metodología, resultados y DOI. Y una regla de oro: siempre sabrás qué nivel de contenido estás leyendo."
          action={{ to: "/investigacion", label: "Ir al área de investigación" }}
        />
        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-10 items-start">
          <Reveal>
            <div className="bg-white border border-line rounded-lg p-6 md:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                Niveles de contenido BiolNexo
              </p>
              <div className="mt-5 space-y-5">
                <div className="border-l-2 border-primary/60 pl-4">
                  <TierBadge tier="Investigación publicada" small />
                  <p className="mt-2 text-[13px] leading-relaxed text-inksoft">
                    Estudios con metodología, resultados y DOI verificable.
                    Trazabilidad completa de fuentes.
                  </p>
                </div>
                <div className="border-l-2 border-bio pl-4">
                  <TierBadge tier="Interpretación BiolNexo" small />
                  <p className="mt-2 text-[13px] leading-relaxed text-inksoft">
                    Análisis editorial propio sobre ciencia publicada: contexto,
                    límites y lectura crítica.
                  </p>
                </div>
                <div className="border-l-2 border-aqua pl-4">
                  <TierBadge tier="Divulgación científica" small />
                  <p className="mt-2 text-[13px] leading-relaxed text-inksoft">
                    Conocimiento establecido explicado con claridad para todo
                    público, con referencias al final.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="space-y-5">
            {publications.slice(0, 2).map((p, i) => (
              <Reveal key={p.id} delay={i * 120}>
                <PublicationCard pub={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="relative bg-primary-deep overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-60" aria-hidden />
        <div
          className="absolute -top-32 right-[10%] w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(15,168,192,0.16), transparent 65%)" }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-aqua">
              Boletín semanal
            </p>
            <h2 className="mt-3 font-display font-bold text-3xl md:text-4xl text-white leading-tight tracking-tight">
              La ciencia de la semana, directo a tu bandeja.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#b6c9dc] max-w-lg">
              Artículos nuevos, datasets interesantes, herramientas
              bioinformáticas y protocolos — sin ruido, con fuentes.
            </p>
          </Reveal>
          <Reveal delay={150}>
            {subscribed ? (
              <div className="flex items-center gap-4 bg-white/8 bg-white/10 border border-aqua/40 rounded-lg p-6">
                <span className="w-11 h-11 rounded-full bg-aqua text-navy flex items-center justify-center shrink-0">
                  <IconCheck className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-display font-semibold text-white text-lg">
                    ¡Listo! Suscripción registrada.
                  </p>
                  <p className="font-mono text-[12px] text-[#b6c9dc] mt-1">
                    Formulario de demostración: no se almacenan datos reales.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubscribe} noValidate>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Correo electrónico
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="flex-1 bg-navy-2 border border-white/20 rounded-md px-5 py-3.5 text-white placeholder:text-[#7e9ab5] outline-none focus:border-aqua transition-colors"
                  />
                  <button type="submit" className={btn.light}>
                    Suscribirme <IconArrow className="w-4 h-4" />
                  </button>
                </div>
                {emailError && (
                  <p className="mt-2.5 font-mono text-[12px] text-[#f0b3a5]">{emailError}</p>
                )}
                <p className="mt-3 font-mono text-[11px] text-[#7e9ab5]">
                  Sin spam · cancela cuando quieras · demo sin almacenamiento
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}


