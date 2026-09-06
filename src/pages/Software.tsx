import { useEffect, useState } from "react";
import { fetchSoftwareProjects, softwareProjects as fallback } from "../data/content";
import { SoftwareCard } from "../components/Cards";
import { Reveal, SectionHead, usePageTitle } from "../components/ui";
import { isSupabaseConfigured } from "../lib/supabase";
import type { SoftwareProject } from "../types";

export default function SoftwarePage() {
  usePageTitle("Software & Salud — BiolNexo");
  const [projects, setProjects] = useState<SoftwareProject[]>(fallback);
  const [backend, setBackend] = useState(false);

  useEffect(() => {
    fetchSoftwareProjects().then((data) => {
      setProjects(data);
      setBackend(isSupabaseConfigured);
    });
  }, []);

  return (
    <main className="pb-24">
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-40" aria-hidden />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(15,168,192,0.18), transparent 65%)" }} aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-aqua">[ Software & Salud ]</p>
            <h1 className="mt-3 font-display font-bold text-[clamp(1.75rem,7vw,2.5rem)] md:text-[2.6rem] tracking-tight text-white leading-[1.05] max-w-3xl">
              Programas que miden, calculan y enseñan salud.
            </h1>
            <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-[#9db4ca] max-w-2xl">
              Apps y webs hechas por BiolNexo: con captura o video, y links de descarga y repositorio. Para estudiantes, curiosos y profesionales.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-10 sm:py-16">
        <SectionHead
          index="01"
          eyebrow="Proyectos"
          title="Software propio"
          lead="Resultados de programas hechos en salud y ciencias. Cada card trae imagen o video + descarga y repo."
        />
        {backend && (
          <p className="mb-4 font-mono text-[11px] text-bio bg-bio-soft border border-bio/20 inline-flex px-3 py-1 rounded-full">
            ● Backend Supabase conectado
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <SoftwareCard project={p} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
            <p className="font-display font-bold text-lg text-ink">¿Tienes un proyecto que compartir?</p>
            <p className="mt-2 font-mono text-[12px] text-muted">Envía capture + repo y lo publicamos con crédito.</p>
            <a href="mailto:biolnexo@gmail.com" className="mt-4 inline-flex items-center gap-2 bg-navy text-white rounded-full px-5 py-2.5 font-semibold text-[13px] hover:bg-primary transition-colors">
              Enviar a biolnexo@gmail.com
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
