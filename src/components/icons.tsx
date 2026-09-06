import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { className?: string };

const base = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: p.className ?? "w-5 h-5",
  "aria-hidden": true,
});

/* Marca: hexágono molecular con nodos conectados */
export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 2.5l11.26 6.5v13L16 28.5 4.74 22V9L16 2.5z"
        fill="#0E4E8C"
      />
      <path
        d="M16 2.5l11.26 6.5v13L16 28.5 4.74 22V9L16 2.5z"
        stroke="#0FA8C0"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <path d="M10.5 11.5l5.5 4 5.5 4" stroke="#F4F7FA" strokeWidth="1.4" />
      <path
        d="M10.5 20.5c3.6-1.2 7.4-1.2 11-6.5"
        stroke="#0FA8C0"
        strokeWidth="1.1"
        strokeOpacity="0.8"
      />
      <circle cx="10.5" cy="11.5" r="2" fill="#F4F7FA" />
      <circle cx="16" cy="15.5" r="2" fill="#0FA8C0" />
      <circle cx="21.5" cy="19.5" r="2" fill="#2EC48A" />
    </svg>
  );
}

export const IconHelix = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3c0 4.5 10 5 10 9s-10 4.5-10 9" />
    <path d="M17 3c0 4.5-10 5-10 9s10 4.5 10 9" />
    <path d="M8.2 6h7.6M8.2 18h7.6M9.5 12h5" strokeOpacity="0.65" />
  </svg>
);

export const IconChip = (p: P) => (
  <svg {...base(p)}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
    <circle cx="12" cy="12" r="2.2" />
    <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5H6.5M3 14.5H6.5M17.5 9.5H21M17.5 14.5H21" strokeOpacity="0.7" />
  </svg>
);

export const IconFlask = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 3h5M10.5 3v5.2L5.4 17a2.4 2.4 0 002.1 3.5h9a2.4 2.4 0 002.1-3.5l-5.1-8.8V3" />
    <path d="M7.6 14.5h8.8" strokeOpacity="0.7" />
    <circle cx="11" cy="17.3" r="0.4" fill="currentColor" />
    <circle cx="13.6" cy="18.2" r="0.4" fill="currentColor" />
  </svg>
);

export const IconMicroscope = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 21h12M9 21a7 7 0 005.6-11.2" />
    <path d="M10.5 3.5l3 3-4.5 4.5-3-3z" />
    <path d="M13.5 6.5l1.5-1.5M6 11l-1 1M9.5 21v-2.5" strokeOpacity="0.7" />
  </svg>
);

export const IconLeaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20C4 10 10 4.5 20 4c.5 10-5 16-14.5 16" />
    <path d="M4 20c4-6.5 8-10 12.5-12" strokeOpacity="0.7" />
  </svg>
);

export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 20.5h17" />
    <rect x="5.5" y="12" width="3" height="6" rx="0.5" />
    <rect x="10.5" y="7" width="3" height="11" rx="0.5" />
    <rect x="15.5" y="10" width="3" height="8" rx="0.5" />
    <path d="M5.5 9L11 4.5l3 2.5 4.5-3.5" strokeOpacity="0.75" />
  </svg>
);

export const IconGear = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" strokeOpacity="0.8" />
  </svg>
);

export const IconTerminal = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4.5" width="18" height="15" rx="1.6" />
    <path d="M7 9.5l3.5 2.75L7 15M12.5 15H17" />
  </svg>
);

export const IconAtom = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="8.5" ry="3.4" />
    <ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(120 12 12)" />
  </svg>
);

export const IconTree = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20V4M4 8h6v4h6M4 16h6v-4" />
    <circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12.5" cy="16" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="6.5" cy="4" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconAlign = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 6h13M3 12h18M3 18h10" strokeWidth="2.6" />
    <circle cx="19.5" cy="6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="16.5" cy="18" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const IconData = (p: P) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
    <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" strokeOpacity="0.8" />
  </svg>
);

export const IconBook = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15.5H6.5A2.5 2.5 0 004 21z" />
    <path d="M4 18.5A2.5 2.5 0 016.5 16H20" strokeOpacity="0.7" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l5 5" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13.5 6l6 6-6 6" />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 17.5L17.5 6.5M8.5 6.5h9v9" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="1.8" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c1.3-3.5 4.1-5 7.5-5s6.2 1.5 7.5 5" />
  </svg>
);

export const IconTag = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 12.5v-9h9L21 12l-8.5 8.5z" />
    <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const IconAlert = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5L2.5 20h19z" />
    <path d="M12 9.5v5" />
    <circle cx="12" cy="17.2" r="0.5" fill="currentColor" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l7.5 2.8v5.7c0 4.6-3 8-7.5 9.5-4.5-1.5-7.5-4.9-7.5-9.5V5.8z" />
    <path d="M8.8 12l2.2 2.2 4.2-4.2" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="1.8" />
    <path d="M15.5 8.5v-3a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2h3" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);

export const IconExternal = (p: P) => (
  <svg {...base(p)}>
    <path d="M10 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-4" />
    <path d="M13 4h7v7M20 4l-9 9" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5v11M7.5 10l4.5 4.5L16.5 10M4 20h16" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h11" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.8" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

export const IconQuote = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 13.5c0-4 2.3-6.8 5.5-8M5 13.5V18h5v-4.5H6.8M14 13.5c0-4 2.3-6.8 5.5-8M14 13.5V18h5v-4.5h-3.2" strokeOpacity="0.9" />
  </svg>
);

/* --- redes sociales (trazos propios) --- */
export const IconFacebook = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 8.5H17V5h-2.5A3.5 3.5 0 0011 8.5V11H8.5v3.5H11V21h3.5v-6.5H17L17.5 11h-3v-2a.9.9 0 010-.5z" />
  </svg>
);

export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconYoutube = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
    <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTiktok = (p: P) => (
  <svg {...base(p)}>
    <path d="M13.5 4v10.8a3.4 3.4 0 11-3-3.4" />
    <path d="M13.5 6.5c.8 2 2.5 3.2 5 3.4" />
  </svg>
);
