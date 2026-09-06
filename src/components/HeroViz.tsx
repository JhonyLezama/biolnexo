/**
 * Visualización del hero: doble hélice de ADN + red de nodos + anillos de
 * datos. SVG generado proceduralmente con chips de datos flotantes.
 */

const CX = 300;
const TOP = 96;
const BOTTOM = 504;
const AMP = 86;
const TURNS = 1.6;

function helixPoints(phase: number) {
  const pts: [number, number][] = [];
  for (let y = TOP; y <= BOTTOM; y += 5) {
    const t = (y - TOP) / (BOTTOM - TOP);
    const x = CX + AMP * Math.sin(t * Math.PI * 2 * TURNS + phase) * (0.55 + 0.45 * Math.sin(Math.PI * t));
    pts.push([x, y]);
  }
  return pts;
}

function toPath(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

const nodes: [number, number, number][] = [
  [86, 130, 4], [150, 84, 3], [472, 108, 5], [530, 208, 3],
  [60, 330, 3], [110, 470, 5], [500, 430, 4], [548, 340, 3],
  [210, 560, 3], [420, 560, 4], [40, 220, 3], [560, 500, 3],
];

const edges: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 10], [10, 4], [4, 5],
  [3, 7], [7, 6], [6, 11], [5, 8], [9, 6], [8, 9],
];

export default function HeroViz() {
  const strandA = helixPoints(0);
  const strandB = helixPoints(Math.PI);

  const rungs: { x1: number; y1: number; x2: number; y2: number; base: "a" | "b" }[] = [];
  for (let y = TOP + 14; y <= BOTTOM - 10; y += 24) {
    const t = (y - TOP) / (BOTTOM - TOP);
    const env = 0.55 + 0.45 * Math.sin(Math.PI * t);
    const s = Math.sin(t * Math.PI * 2 * TURNS);
    const x1 = CX + AMP * s * env;
    const x2 = CX - AMP * s * env;
    if (Math.abs(s) * env > 0.22) {
      rungs.push({ x1, y1: y, x2, y2: y, base: s > 0 ? "a" : "b" });
    }
  }

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none" aria-hidden>
      <svg viewBox="0 0 600 600" className="w-full h-auto block">
        <defs>
          <linearGradient id="strandA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0FA8C0" />
            <stop offset="100%" stopColor="#0E4E8C" />
          </linearGradient>
          <linearGradient id="strandB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0E8F5F" />
            <stop offset="100%" stopColor="#0FA8C0" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0FA8C0" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#0FA8C0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* halo central */}
        <circle cx={CX} cy={300} r="250" fill="url(#coreGlow)" />

        {/* anillos orbitales */}
        <circle cx={CX} cy={300} r="262" fill="none" stroke="#0E4E8C" strokeOpacity="0.16" strokeDasharray="3 9" className="orbit-spin" />
        <circle cx={CX} cy={300} r="222" fill="none" stroke="#0FA8C0" strokeOpacity="0.22" strokeDasharray="2 12" className="orbit-spin-rev" />

        {/* red de nodos */}
        <g stroke="#0E4E8C" strokeOpacity="0.22" strokeWidth="1">
          {edges.map(([a, b], i) => (
            <line
              key={i}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
            />
          ))}
        </g>
        {nodes.map(([x, y, r], i) => (
          <g key={i}>
            {i % 3 === 0 && (
              <circle cx={x} cy={y} r={r + 5} fill="#0FA8C0" fillOpacity="0.18" className="node-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
            )}
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={i % 2 === 0 ? "#0E4E8C" : "#0E8F5F"}
              fillOpacity={i % 2 === 0 ? 0.75 : 0.65}
            />
          </g>
        ))}

        {/* doble hélice */}
        <g>
          {rungs.map((r, i) => (
            <g key={i}>
              <line
                x1={r.x1}
                y1={r.y1}
                x2={r.x2}
                y2={r.y2}
                stroke={r.base === "a" ? "#0FA8C0" : "#0E8F5F"}
                strokeOpacity="0.5"
                strokeWidth="1.6"
              />
              <circle cx={(r.x1 + r.x2) / 2} cy={r.y1} r="2.6" fill="#0B1C2C" fillOpacity="0.55" />
            </g>
          ))}
          <path d={toPath(strandA)} fill="none" stroke="url(#strandA)" strokeWidth="3.4" strokeLinecap="round" className="helix-flow" />
          <path d={toPath(strandB)} fill="none" stroke="url(#strandB)" strokeWidth="3.4" strokeLinecap="round" className="helix-flow" style={{ animationDelay: "-7s" }} />
          <circle cx={CX} cy={TOP - 8} r="5" fill="#0FA8C0" className="node-pulse" />
          <circle cx={CX} cy={BOTTOM + 8} r="5" fill="#0E8F5F" className="node-pulse" style={{ animationDelay: "1.6s" }} />
        </g>
      </svg>

      {/* chips de datos flotantes */}
      <div className="absolute top-[12%] left-[-2%] sm:left-[-6%] anim-float">
        <div className="bg-white/95 border border-line rounded-md shadow-lg shadow-navy/8 px-3.5 py-2 font-mono text-[11px] text-primary-deep">
          <span className="text-aqua">▸</span> ATG·GCT·AAG·TCC
        </div>
      </div>
      <div className="absolute top-[30%] right-[-2%] sm:right-[-5%] anim-float-2">
        <div className="bg-navy text-white rounded-md shadow-lg shadow-navy/20 px-3.5 py-2 font-mono text-[11px]">
          <span className="text-aqua">pLDDT</span> 92.4 · modelo OK
        </div>
      </div>
      <div className="absolute bottom-[24%] left-[-3%] sm:left-[-7%] anim-float-2">
        <div className="bg-white/95 border border-line rounded-md shadow-lg shadow-navy/8 px-3.5 py-2 font-mono text-[11px] text-bio">
          R² 0.94 <span className="text-muted">· σ 0.003</span>
        </div>
      </div>
      <div className="absolute bottom-[8%] right-[2%] anim-float">
        <div className="bg-white/95 border border-line rounded-md shadow-lg shadow-navy/8 px-3.5 py-2 font-mono text-[11px] text-primary-deep">
          16S rRNA <span className="text-aqua">· 251 pb</span>
        </div>
      </div>
    </div>
  );
}
