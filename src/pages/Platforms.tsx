import { useState } from "react";
import { Link } from "react-router-dom";
import {
  datasets,
  experiments,
  genomicGrowth,
  publications,
  sequencingCost,
} from "../data/content";
import type { Experiment } from "../types";
import { DatasetCard, PublicationCard } from "../components/Cards";
import {
  ConsoleFrame,
  CostChart,
  GrowthArea,
} from "../components/Viz";
import { Reveal, SectionHead, TierBadge, btn, usePageTitle } from "../components/ui";
import {
  IconAlert,
  IconArrow,
  IconCheck,
  IconChevron,
  IconExternal,
  IconFlask,
  IconShield,
} from "../components/icons";

const levelStyles: Record<string, string> = {
  Educativo: "bg-bio-soft text-bio border-bio/30",
  Supervisado: "bg-warn-soft text-warn border-warn/30",
  "Protocolo de investigación": "bg-primary/10 text-primary-deep border-primary/30",
};

function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="relative bg-navy overflow-hidden">
      <div className="absolute inset-0 grid-dots-dark opacity-60" aria-hidden />
      <div
        className="absolute -top-24 right-[-5%] w-[440px] h-[440px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(15,168,192,0.12), transparent 65%)" }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-32 md:pt-36 pb-14 md:pb-16">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-aqua">[ {eyebrow} ]</p>
          <h1 className="mt-4 font-display font-bold text-4xl md:text-5xl tracking-tight text-white max-w-3xl leading-[1.08]">
            {title}
          </h1>
          <p className="mt-5 text-[15.5px] md:text-lg leading-relaxed text-[#9db4ca] max-w-2xl">
            {lead}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- EXPERIMENTOS ----------------------------- */

function ExperimentItem({ ex, open, onToggle }: { ex: Experiment; open: boolean; onToggle: () => void }) {
  return (
    <article className={`bg-white border rounded-lg overflow-hidden transition-all duration-300 ${open ? "border-primary/50 shadow-xl shadow-navy/8" : "border-line hover:border-primary/30"}`}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left px-6 py-5 flex items-center gap-5"
      >
        <span className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 transition-colors ${open ? "bg-primary text-white" : "bg-mist text-primary"}`}>
          <IconFlask className="w-5 h-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2.5">
            <span className={`font-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-sm border ${levelStyles[ex.level]}`}>
              {ex.level}
            </span>
            <span className="font-mono text-[11px] text-muted">{ex.area}</span>
          </span>
          <span className="block mt-1.5 font-display font-bold text-[17px] md:text-lg text-ink leading-snug">
            {ex.title}
          </span>
        </span>
        <span className="hidden sm:flex flex-col items-end shrink-0 font-mono text-[11px] text-muted">
          <span>{ex.duration}</span>
          <span className="mt-0.5">dificultad {ex.difficulty.toLowerCase()}</span>
        </span>
        <IconChevron className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={`grid transition-[grid-template-rows] duration-400 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-7 pt-1 border-t border-line">
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Objetivo</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-inksoft">{ex.objective}</p>

                <h3 className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Materiales</h3>
                <ul className="mt-2.5 space-y-1.5">
                  {ex.materials.map((m, i) => (
                    <li key={i} className="flex gap-2.5 text-[13.5px] text-inksoft leading-relaxed">
                      <IconCheck className="w-4 h-4 text-bio shrink-0 mt-0.5" /> {m}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Explicación científica</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-inksoft">{ex.explanation}</p>
              </div>

              <div>
                <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Procedimiento</h3>
                <ol className="mt-3 space-y-3">
                  {ex.procedure.map((step, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[13.5px] leading-relaxed text-inksoft">{step}</p>
                    </li>
                  ))}
                </ol>

                <h3 className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bio">Resultados esperados</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-inksoft">{ex.results}</p>

                <h3 className="mt-7 font-mono text-[10.5px] uppercase tracking-[0.2em] text-bio">Observaciones</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-inksoft">{ex.observations}</p>
              </div>
            </div>

            {/* Seguridad */}
            <div className="mt-8 bg-warn-soft border border-warn/25 rounded-lg p-5">
              <p className="flex items-center gap-2.5 font-display font-semibold text-[14px] text-warn">
                <IconAlert className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} /> Seguridad
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {ex.safety.map((s, i) => (
                  <li key={i} className="text-[13.5px] leading-relaxed text-inksoft pl-1">• {s}</li>
                ))}
              </ul>
            </div>

            {/* Referencias */}
            <div className="mt-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Referencias del protocolo</p>
              <ul className="mt-2.5 space-y-1.5">
                {ex.references.map((r, i) => (
                  <li key={i} className="text-[13px] text-inksoft">
                    {r.text}{" "}
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[11.5px] text-primary hover:text-primary-deep">
                        {r.url.replace("https://", "")} <IconExternal className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ExperimentosPage() {
  usePageTitle("Experimentos — BioNexo");
  const [openId, setOpenId] = useState<string | null>(experiments[0].id);

  return (
    <main className="pb-24">
      <PageHero
        eyebrow="Laboratorio"
        title="Ciencia en el laboratorio"
        lead="Experimentos educativos y protocolos de investigación documentados paso a paso: objetivo, materiales, procedimiento, resultados, observaciones, explicación y seguridad."
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16">
        <Reveal>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-line rounded-lg p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm border bg-bio-soft text-bio border-bio/30">Educativo</span>
              <p className="mt-3 text-[13px] leading-relaxed text-inksoft">
                Aptos para aula o casa, con materiales accesibles y riesgo mínimo. Recomendado con acompañamiento.
              </p>
            </div>
            <div className="bg-white border border-line rounded-lg p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm border bg-warn-soft text-warn border-warn/30">Supervisado</span>
              <p className="mt-3 text-[13px] leading-relaxed text-inksoft">
                Requiere supervisión docente o técnica, equipo de protección y manejo responsable de cultivos o solventes.
              </p>
            </div>
            <div className="bg-white border border-line rounded-lg p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm border bg-primary/10 text-primary-deep border-primary/30">Protocolo de investigación</span>
              <p className="mt-3 text-[13px] leading-relaxed text-inksoft">
                Pensado para laboratorio: reactivos de grado molecular, equipos calibrados y personal capacitado.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <aside className="flex gap-3.5 items-start bg-navy rounded-lg px-6 py-5 mb-10">
            <IconShield className="w-6 h-6 text-aqua shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-[#c3d4e4]">
              <strong className="text-white">La seguridad primero.</strong> Todo protocolo incluye sus
              advertencias específicas. Ante la duda, no improvises: consulta a una persona con
              formación en laboratorio y revisa las fichas de seguridad de cada reactivo.
            </p>
          </aside>
        </Reveal>

        <div className="space-y-4">
          {experiments.map((ex, i) => (
            <Reveal key={ex.id} delay={i * 60}>
              <ExperimentItem
                ex={ex}
                open={openId === ex.id}
                onToggle={() => setOpenId(openId === ex.id ? null : ex.id)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 bg-white border border-dashed border-primary/30 rounded-lg p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="font-display font-bold text-xl text-ink">¿Tienes un protocolo que compartir?</p>
              <p className="mt-1.5 text-[14px] text-inksoft">
                BioNexo crece con la comunidad: envíanos tu experimento documentado y lo revisamos para publicarlo.
              </p>
            </div>
            <Link to="/contacto" className={`${btn.primary} shrink-0`}>
              Proponer protocolo <IconArrow className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ------------------------------- DATOS ------------------------------- */

export function DatosPage() {
  usePageTitle("Datos científicos — BioNexo");

  return (
    <main className="pb-24">
      <PageHero
        eyebrow="Datos"
        title="Datos científicos"
        lead="Conjuntos de datos biológicos, estadísticas y visualizaciones interactivas. Repositorios reales con enlace directo y datasets de demostración claramente etiquetados."
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16">
        <SectionHead
          index="A"
          eyebrow="Visualizaciones"
          title="La economía y el volumen de la genómica"
          lead="Dos curvas que explican por qué la biología se volvió una ciencia de datos: el costo de secuenciar se desplomó y el volumen de datos públicos no dejó de crecer."
        />
        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal>
            <ConsoleFrame title="costo_genoma.log — tendencia histórica (ilustrativa, basada en NHGRI)">
              <CostChart data={sequencingCost} />
            </ConsoleFrame>
          </Reveal>
          <Reveal delay={120}>
            <ConsoleFrame title="datos_genomicos.csv — volumen público estimado (ilustrativo)">
              <GrowthArea data={genomicGrowth} />
            </ConsoleFrame>
          </Reveal>
        </div>

        <div className="mt-20">
          <SectionHead
            index="B"
            eyebrow="Repositorios y datasets"
            title="Dónde están los datos de la vida"
            lead="Cuatro infraestructuras reales de datos abiertos —más dos datasets de demostración de BioNexo Labs para practicar análisis sin riesgo."
          />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((d, i) => (
            <Reveal key={d.id} delay={(i % 3) * 90}>
              <DatasetCard dataset={d} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-line rounded-lg p-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">Principios FAIR</p>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-inksoft">
                Todo dataset referenciado en BioNexo cumple con ser{" "}
                <strong>encontrable, accesible, interoperable y reutilizable</strong>. Si un
                dataset no puede citarse con un identificador estable, lo indicamos explícitamente.
              </p>
            </div>
            <div className="bg-white border border-line rounded-lg p-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">¿Sugieres un dataset?</p>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-inksoft">
                ¿Conoces un repositorio o publicaste datos que deberían estar aquí? Escríbenos con
                el enlace y la licencia: curamos la colección de forma continua.
              </p>
              <Link to="/contacto" className="mt-4 inline-flex items-center gap-2 font-display font-semibold text-[14px] text-primary hover:text-primary-deep transition-colors">
                Sugerir dataset <IconArrow className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

/* ---------------------------- INVESTIGACIÓN ---------------------------- */

export function InvestigacionPage() {
  usePageTitle("Investigación científica — BioNexo");

  const tiers = [
    {
      tier: "Investigación publicada" as const,
      desc: "Estudios originales o republicados con pregunta científica explícita, metodología reproducible, resultados, discusión y DOI verificable. Es el nivel con mayor exigencia de trazabilidad.",
      req: ["DOI o identificador persistente", "Metodología y datos citables", "Referencias completas"],
    },
    {
      tier: "Interpretación BioNexo" as const,
      desc: "Análisis editorial del equipo: contextualizamos ciencia publicada, señalamos límites metodológicos y ofrecemos una lectura crítica propia. Siempre enlazamos las fuentes primarias.",
      req: ["Fuentes primarias enlazadas", "Opinión señalada como tal", "Limitaciones explícitas"],
    },
    {
      tier: "Divulgación científica" as const,
      desc: "Conocimiento establecido explicado para todo público. No reporta novedades: ordena, traduce y conecta ideas consolidadas, con referencias al final de cada artículo.",
      req: ["Conocimiento consolidado", "Lenguaje accesible", "Referencias de soporte"],
    },
  ];

  return (
    <main className="pb-24">
      <PageHero
        eyebrow="Investigación"
        title="Investigación científica con trazabilidad completa"
        lead="Cada publicación presenta su pregunta, metodología, resultados y DOI. Y cada contenido de la plataforma declara su nivel: investigación publicada, interpretación BioNexo o divulgación."
      />

      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-12 md:pt-16">
        <SectionHead
          index="A"
          eyebrow="Niveles de contenido"
          title="Siempre sabrás qué estás leyendo"
          lead="La confianza científica no se declara: se estructura. Estos son los tres niveles de contenido de BioNexo y los requisitos de cada uno."
        />
        <div className="space-y-4">
          {tiers.map((t, i) => (
            <Reveal key={t.tier} delay={i * 90}>
              <div className="bg-white border border-line rounded-lg p-6 md:p-7 grid md:grid-cols-[240px_1fr] gap-6 hover:border-primary/30 transition-colors">
                <div>
                  <TierBadge tier={t.tier} />
                  <ul className="mt-4 space-y-1.5">
                    {t.req.map((r) => (
                      <li key={r} className="flex gap-2 text-[12.5px] text-muted font-mono">
                        <IconCheck className="w-3.5 h-3.5 text-bio shrink-0 mt-0.5" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-[14.5px] leading-relaxed text-inksoft">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <SectionHead
            index="B"
            eyebrow="Publicaciones"
            title="Fichas de investigación"
            lead="Estas fichas de demostración muestran el formato exacto que BioNexo generará para investigaciones reales: pregunta, método, resultados, conclusión y DOI."
          />
        </div>

        <Reveal>
          <aside className="flex gap-3.5 items-start bg-warn-soft border border-warn/25 rounded-lg px-6 py-4 mb-8">
            <IconAlert className="w-5 h-5 text-warn shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-inksoft">
              <strong className="text-warn">Aviso:</strong> las publicaciones listadas son{" "}
              <em>de demostración</em> — ilustran la ficha editorial de BioNexo y sus DOI no
              resuelven a documentos reales.
            </p>
          </aside>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {publications.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 100}>
              <PublicationCard pub={p} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 bg-navy rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 grid-dots-dark opacity-50" aria-hidden />
            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-aqua">
                  Trazabilidad de fuentes
                </p>
                <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-white leading-tight">
                  ¿Publicaste una investigación?
                </h2>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[#9db4ca] max-w-xl">
                  Envíanos tu artículo con DOI, datos y metodología. Nuestro equipo editorial
                  verifica las fuentes y construye la ficha completa para la plataforma.
                </p>
              </div>
              <Link to="/contacto" className={`${btn.light} shrink-0`}>
                Enviar publicación <IconArrow className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
