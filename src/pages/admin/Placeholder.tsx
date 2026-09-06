import { Link } from "react-router-dom";
export default function Placeholder({ title, desc }: { title: string; desc?: string }) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary">[ Admin · {title} ]</p>
      <h1 className="mt-2 font-display font-bold text-3xl text-ink">{title}</h1>
      <p className="mt-2 text-[14px] text-inksoft max-w-xl">{desc ?? "Módulo en construcción — Fase 3/4. Usa el dashboard mientras tanto."}</p>
      <div className="mt-6 bg-white border border-dashed border-line rounded-2xl p-12 text-center">
        <p className="font-mono text-[12px] text-muted">Próximamente</p>
        <p className="mt-2 font-display font-bold text-ink">Editor {title} con bloques + URL/archivo</p>
        <Link to="/admin" className="mt-4 inline-flex px-5 py-2.5 rounded-full bg-navy text-white text-[13px] font-semibold hover:bg-primary">Volver al dashboard</Link>
      </div>
    </main>
  );
}
