# BiolNexo

**Ciencia • Tecnología • Ingeniería** — Plataforma editorial y de datos que conecta conocimiento, datos y tecnología para comprender la ciencia.

> Biología, genética, bioinformática, biotecnología, IA científica, ecología, datos e investigación con trazabilidad completa.

![BiolNexo Cover](public/brand/biolnexo-cover-1640x924.png)

## Demo
- **Web:** `pnpm dev` → http://localhost:3000
- **Contacto:** [biolnexo@gmail.com](mailto:biolnexo@gmail.com)
- **Facebook:** https://web.facebook.com/profile.php?id=61594219768551

## Stack
- **Frontend:** React 18 + Vite 6 + Tailwind CSS 4 + React Router (HashRouter) + Framer Motion
- **Gestor:** `pnpm` (`packageManager: pnpm@10.29.3`, `pnpm-lock.yaml`)
- **Datos tipados:** `src/types.ts` (Article / Category / Experiment / Dataset / Publication) → listo para API/CMS
- **Visualizaciones:** Recharts, SVG procedurales (ADN, filogenia, alineamiento)

## Estructura
```
src/
  components/  Header, Footer, HeroViz, Viz, Cards, ui, icons
  pages/       Home, Category, Article, Search, Platforms, Static, AdminDrafts
  data/        content.ts (12 artículos, 5 experimentos, 6 datasets)
public/brand/  Logo PNG/WebP/SVG perfil (1024) + portada (1640×924) para Facebook
scripts/       generate-brand.py, agent_draft.py
supabase/      migrations/20260906_biolnexo_drafts.sql
```

## Instalación
```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # vite build -> dist/
pnpm typecheck
```

## Brand Kit
En `public/brand/`:
- `biolnexo-profile-1024.png` / `.webp` — perfil Facebook (1024)
- `biolnexo-cover-1640x924.png` / `.webp` — portada (1640×924)
- `biolnexo-logo-mark.svg` / `biolnexo-logo-full.svg` — vectores

Regenerar: `python scripts/generate-brand.py` (requiere Pillow)

## Despliegue en Vercel
1. Conecta repo `JhonyLezama/biolnexo` en https://vercel.com/new
2. Framework: **Vite** (auto). Build: `pnpm build` → Output: `dist/`
3. Env (opcional): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `LLM_ENABLED`, `GEMINI_API_KEY`
4. Deploy → preview + producción auto en `main`

`vercel.json` ya incluye rewrites SPA (HashRouter no lo necesita, pero listo para BrowserRouter).

## Backend — Roadmap
**Fase 01 (actual):** frontend + datos mock tipados
**Fase 02:** Supabase + panel `/admin/borradores`
```sql
-- supabase/migrations/20260906_biolnexo_drafts.sql
sources, drafts (pending_review), draft_reviews + RLS
```
**Fase 03:** Agente IA asistido 3×/semana ES/EN
```bash
LLM_ENABLED=false python scripts/agent_draft.py --area bioinformatica --lang es # dry-run
LLM_ENABLED=true GEMINI_API_KEY=xxx python scripts/agent_draft.py --lang es # real (gemini-2.0-flash, free 60 req/min)
```
Cron L/M/V 06:00 UTC → `drafts` → aprobación humana en `/admin/borradores` → publica en `articles`. Ver `.env.example` y `docs`.

## Git
```bash
git add .
git commit -m "feat: BiolNexo brand + responsive + agente asistido"
git branch -M main
git remote add origin https://github.com/JhonyLezama/biolnexo.git # si no existe
git push -u origin main
```

## Licencia
Artículos demo `CC BY-NC 4.0`. Código privado.

— BiolNexo, ciencia que conecta.
