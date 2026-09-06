import { useRef, useState } from "react";
import type { ChartPoint } from "../types";

/* Marco tipo consola para visualizaciones bioinformáticas */
export function ConsoleFrame({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-navy-2 border border-white/10 rounded-lg overflow-hidden shadow-xl shadow-navy/30 min-w-0 w-full ${className}`}>
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-white/10 bg-navy min-w-0 overflow-hidden">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e0654f]/80 shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e0a83f]/80 shrink-0" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3fbf7f]/80 shrink-0" />
        <span className="ml-2 sm:ml-3 font-mono text-[10px] sm:text-[11px] text-[#7e9ab5] truncate min-w-0 flex-1">{title}</span>
      </div>
      <div className="p-3 sm:p-4 md:p-5 min-w-0">{children}</div>
    </div>
  );
}

/* ----------------- Costo de secuenciación (log, interactivo) ----------------- */

export function CostChart({ data }: { data: ChartPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const W = 640;
  const H = 300;
  const padL = 10;
  const padB = 34;
  const padT = 30;
  const logs = data.map((d) => Math.log10(d.value));
  const maxL = Math.max(...logs);
  const minL = Math.min(...logs);
  const barW = 44;
  const gap = (W - padL * 2 - barW * data.length) / (data.length - 1);

  return (
    <div className="min-w-0 w-full overflow-hidden">
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto min-w-0 block"
          role="img"
          aria-label="Evolución del costo de secuenciar un genoma humano"
          preserveAspectRatio="xMidYMid meet"
        >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={W - padL}
            y1={padT + (H - padT - padB) * f}
            y2={padT + (H - padT - padB) * f}
            stroke="#7e9ab5"
            strokeOpacity="0.16"
            strokeDasharray="3 6"
          />
        ))}
        {data.map((d, i) => {
          const t = (logs[i] - minL) / (maxL - minL);
          const h = 26 + t * (H - padT - padB - 40);
          const x = padL + i * (barW + gap);
          const y = H - padB - h;
          const isActive = active === i;
          return (
            <g
              key={d.label}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive((prev) => (prev === i ? null : i))}
              style={{ cursor: "pointer" }}
            >
              <rect x={x - 8} y={padT - 10} width={barW + 16} height={H - padT - padB + 20} fill="transparent" />
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={3}
                fill={isActive ? "#0FA8C0" : "#0E4E8C"}
                opacity={active === null || isActive ? 0.92 : 0.45}
                className="bar-rise transition-all duration-300"
                style={{ animationDelay: `${i * 90}ms` }}
              />
              <text
                x={x + barW / 2}
                y={y - 8}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="9"
                fill={isActive ? "#0FA8C0" : "#7e9ab5"}
                opacity={isActive ? 1 : 0}
                style={{ transition: "opacity .2s" }}
              >
                {d.display}
              </text>
              <text
                x={x + barW / 2}
                y={H - padB + 18}
                textAnchor="middle"
                fontFamily="IBM Plex Mono, monospace"
                fontSize="9.5"
                fill={isActive ? "#0FA8C0" : "#7e9ab5"}
              >
                {d.label}
              </text>
            </g>
          );
        })}
        </svg>
      </div>
      <p className="mt-2 font-mono text-[11px] sm:text-[11.5px] leading-snug break-words text-[#7e9ab5] min-h-[2.4em] sm:min-h-[1.2em]">
        {active !== null
          ? `${data[active].label} → ${data[active].display} por genoma`
          : "Toca las barras para ver el costo · escala logarítmica"}
      </p>
    </div>
  );
}

/* ----------------- Crecimiento de datos genómicos (área) ----------------- */

export function GrowthArea({ data }: { data: ChartPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 640;
  const H = 260;
  const padL = 14;
  const padR = 14;
  const padT = 22;
  const padB = 32;
  const max = Math.max(...data.map((d) => d.value));

  const pt = (i: number): [number, number] => {
    const x = padL + (i / (data.length - 1)) * (W - padL - padR);
    const y = H - padB - (data[i].value / max) * (H - padT - padB);
    return [x, y];
  };

  const line = data.map((_, i) => pt(i).map((n) => n.toFixed(1)).join(",")).join(" ");
  const area = `${padL},${H - padB} ${line} ${W - padR},${H - padB}`;

  const onMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((x - padL) / (W - padL - padR)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const [hx, hy] = hover !== null ? pt(hover) : [0, 0];

  return (
    <div className="min-w-0 w-full overflow-hidden">
      <div className="w-full overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto min-w-0 block"
          role="img"
          aria-label="Crecimiento ilustrativo de datos genómicos públicos"
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (!touch || !svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = ((touch.clientX - rect.left) / rect.width) * W;
            const idx = Math.round(((x - padL) / (W - padL - padR)) * (data.length - 1));
            setHover(Math.max(0, Math.min(data.length - 1, idx)));
          }}
        >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0FA8C0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0FA8C0" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaFill)" />
        <polyline points={line} fill="none" stroke="#0FA8C0" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => {
          const [x, y] = pt(i);
          return (
            <g key={d.label}>
              <circle cx={x} cy={y} r={hover === i ? 5 : 3} fill={hover === i ? "#0FA8C0" : "#0b2540"} stroke="#0FA8C0" strokeWidth="1.6" style={{ transition: "r .15s" }} />
              {i % 2 === 0 && (
                <text x={x} y={H - padB + 18} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10.5" fill="#7e9ab5">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
        {hover !== null && (
          <g>
            <line x1={hx} x2={hx} y1={padT - 6} y2={H - padB} stroke="#0FA8C0" strokeOpacity="0.4" strokeDasharray="3 4" />
            <rect x={Math.min(Math.max(hx - 46, 6), W - 98)} y={Math.max(hy - 34, 4)} width="92" height="22" rx="4" fill="#071a2e" stroke="#0FA8C0" strokeOpacity="0.5" />
            <text x={Math.min(Math.max(hx, 52), W - 52)} y={Math.max(hy - 19, 19)} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill="#0FA8C0">
              {data[hover].display}
            </text>
          </g>
        )}
        </svg>
      </div>
      <p className="mt-2 font-mono text-[11px] sm:text-[11.5px] leading-snug break-words text-[#7e9ab5]">
        Volumen ilustrativo de datos genómicos públicos (escala relativa) · toca los puntos
      </p>
    </div>
  );
}

/* ------------------------- Árbol filogenético ------------------------- */

const taxa = [
  { name: "H. sapiens", y: 40, x: 420, note: "Chordata · Mammalia" },
  { name: "M. musculus", y: 80, x: 420, note: "Chordata · Mammalia" },
  { name: "D. melanogaster", y: 140, x: 350, note: "Arthropoda · Insecta" },
  { name: "A. thaliana", y: 200, x: 280, note: "Tracheophyta · planta modelo" },
  { name: "S. cerevisiae", y: 240, x: 210, note: "Ascomycota · levadura" },
  { name: "E. coli", y: 280, x: 140, note: "Pseudomonadota · bacteria" },
];

const segments: [number, number, number, number][] = [
  [40, 230, 140, 230],
  [140, 195, 140, 280],
  [140, 195, 210, 195],
  [210, 150, 210, 240],
  [210, 150, 280, 150],
  [280, 100, 280, 200],
  [280, 100, 350, 100],
  [350, 60, 350, 140],
  [350, 60, 420, 60],
  [420, 40, 420, 80],
];

export function PhyloTree() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="min-w-0">
      <div className="w-full overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
        <svg viewBox="0 0 560 300" className="w-full h-auto min-w-[460px] lg:min-w-0" role="img" aria-label="Árbol filogenético ilustrativo de organismos modelo" preserveAspectRatio="xMidYMid meet">
        {segments.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3f6488" strokeWidth="1.6" />
        ))}
        {taxa.map((t, i) => (
          <g
            key={t.name}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "default" }}
          >
            <rect x={t.x - 6} y={t.y - 12} width={560 - t.x} height="24" fill="transparent" />
            <line
              x1={t.x}
              y1={t.y}
              x2={468}
              y2={t.y}
              stroke={hover === i ? "#0FA8C0" : "#0FA8C0"}
              strokeOpacity={hover === i ? 1 : 0.55}
              strokeWidth={hover === i ? 2.4 : 1.6}
              style={{ transition: "all .2s" }}
            />
            <circle cx={t.x} cy={t.y} r="3" fill={hover === i ? "#0FA8C0" : "#3f6488"} />
            <text
              x={476}
              y={t.y + 4}
              fontFamily="IBM Plex Mono, monospace"
              fontSize="12"
              fontStyle="italic"
              fill={hover === i ? "#ffffff" : "#9db4ca"}
              style={{ transition: "fill .2s" }}
            >
              {t.name}
            </text>
          </g>
        ))}
      </svg>
      </div>
      <p className="mt-2 font-mono text-[11px] sm:text-[11.5px] leading-snug break-words text-[#7e9ab5] min-h-[1.2em]">
        {hover !== null
          ? `${taxa[hover].name} — ${taxa[hover].note}`
          : "Cladograma ilustrativo · desliza en móvil → organismos modelo"}
      </p>
    </div>
  );
}

/* --------------------------- Alineamiento --------------------------- */

const alignmentRows = [
  { taxon: "H. sapiens", seq: "ATGGCTAAGTCCGATTCAATGGCTAAGT" },
  { taxon: "M. musculus", seq: "ATGGCTAAGTCCGATTCAATGGCTAGGT" },
  { taxon: "G. gallus", seq: "ATGGCCAAGTCCGATTCGATGGCTAAGC" },
  { taxon: "D. rerio", seq: "ATGGCTAAGTCTGATTCAACGGCCAAGT" },
];

const baseColor: Record<string, string> = {
  A: "#2EC48A",
  T: "#E0654F",
  G: "#E0A83F",
  C: "#4FA3E0",
};

export function AlignmentViz() {
  const [col, setCol] = useState<number | null>(null);
  return (
    <div className="min-w-0">
      <p className="font-mono text-[11px] text-[#7e9ab5] mb-3 leading-snug break-words">
        Alineamiento múltiple · fragmento ilustrativo (28 pb) <span className="text-aqua lg:hidden">› toca una columna</span>
      </p>
      {/* Grid responsive: en móvil 2 filas de 14 bases para evitar scroll */}
      <div className="grid gap-2 sm:gap-1.5">
        {alignmentRows.map((row) => (
          <div
            key={row.taxon}
            className="grid grid-cols-[64px_1fr] sm:grid-cols-[86px_1fr] gap-2 sm:gap-3 items-start sm:items-center min-w-0"
          >
            <span className="font-mono text-[10px] sm:text-[10.5px] italic text-[#9db4ca] leading-tight pt-1 sm:pt-0 truncate">
              {row.taxon}
            </span>
            <div className="grid grid-cols-14 gap-[2px] sm:flex sm:flex-wrap sm:gap-[3px] min-w-0">
              {row.seq.split("").map((base, i) => (
                <span
                  key={i}
                  onMouseEnter={() => setCol(i)}
                  onMouseLeave={() => setCol(null)}
                  onClick={() => setCol((prev) => (prev === i ? null : i))}
                  className="w-full sm:w-[15px] h-[19px] sm:h-[22px] rounded-[3px] flex items-center justify-center font-mono text-[9.5px] sm:text-[11px] font-semibold text-navy transition-all duration-150 cursor-pointer"
                  style={{
                    background: baseColor[base],
                    opacity: col === null || col === i ? 0.92 : 0.35,
                    transform: col === i ? "scaleY(1.12)" : undefined,
                  }}
                >
                  {base}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 font-mono text-[10.5px] text-[#7e9ab5]">
        <div className="flex flex-wrap gap-3 col-span-2 sm:col-auto">
          {Object.entries(baseColor).map(([b, c]) => (
            <span key={b} className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: c }} /> {b}
            </span>
          ))}
        </div>
        <span className="text-aqua sm:ml-auto text-[11px]">
          pos {col !== null ? col + 1 : "—"} / 28
        </span>
      </div>
    </div>
  );
}
