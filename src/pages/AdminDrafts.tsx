import { useEffect, useState } from "react";
import { Reveal, usePageTitle } from "../components/ui";
import { IconCheck, IconClose } from "../components/icons";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

// Mock local para Fase A sin Supabase conectado — lista vacía hasta activar LLM/cron
type MockDraft = {
  id: string;
  title: string;
  area_slug?: string;
  area?: string;
  lang: "es" | "en";
  tier: string;
  status: "pending_review";
};

const mock: MockDraft[] = [];

export default function AdminDrafts() {
  usePageTitle("Borradores — BiolNexo Admin");
  const [drafts, setDrafts] = useState<MockDraft[]>(mock);
  const [backend, setBackend] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    setBackend(true);
    supabase
      .from("drafts")
      .select("id,title,area_slug,lang,tier,status")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error && data?.length) setDrafts(data as MockDraft[]);
      });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pt-28 pb-24">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · borradores ]</p>
        <h1 className="mt-3 font-display font-bold text-3xl text-ink">Borradores del agente</h1>
        <p className="mt-2 text-[14px] text-inksoft max-w-xl">
          3×/semana, ES/EN, asistido. Sin aprobación humana no se publica. Configura <code className="font-mono bg-mist px-1 py-0.5 rounded">LLM_ENABLED=true + GEMINI_API_KEY</code> free tier para activar <code>scripts/agent_draft.py</code>.
        </p>
        <div className="mt-6 rounded-xl bg-aqua-soft border border-aqua/20 p-4 font-mono text-[12px] text-inksoft">
          Estado: <span className="font-bold text-ink">{backend ? "Supabase conectado" : "LLM_ENABLED=false"}</span> {backend ? "— mostrando drafts reales." : "(dry-run) — ejecuta `python scripts/agent_draft.py --area biotecnologia --lang es` para mock."}
          <br />
          Cron recomendado: lunes/miércoles/viernes 06:00 UTC. Nicho: biotecnologia / tendencias / experimentos-caseros / software-salud.
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4">
        {drafts.length === 0 ? (
          <div className="bg-white border border-dashed border-line rounded-xl p-12 text-center">
            <p className="font-display font-bold text-ink">Aún sin borradores</p>
            <p className="mt-2 font-mono text-[12px] text-muted">Activa el agente y aparecerán aquí con tier, idioma y DOI verificado.</p>
          </div>
        ) : (
          drafts.map((d) => (
            <div key={d.id} className="bg-white border border-line rounded-xl p-6 grid gap-3">
              <p className="font-display font-semibold text-ink">{d.title}</p>
              <p className="font-mono text-[11px] text-muted">{(d.area_slug ?? d.area) ?? "—"} · {d.lang} · {d.tier}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full bg-bio text-white font-semibold text-[13px] flex items-center gap-2">
                  <IconCheck className="w-4 h-4" /> Aprobar
                </button>
                <button className="px-4 py-2 rounded-full bg-white border border-line font-semibold text-[13px] flex items-center gap-2">
                  <IconClose className="w-4 h-4" /> Rechazar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 font-mono text-[11px] text-muted">
        Editor aprobador: <span className="text-primary font-semibold">biolnexo@gmail.com</span> · Supabase RLS: solo service_role escribe drafts.
      </div>
    </main>
  );
}
