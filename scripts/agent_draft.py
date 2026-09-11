#!/usr/bin/env python3
"""
BiolNexo — Agente IA asistido (Opción A, apagado por defecto)
3×/semana, bilingüe ES/EN, google_search + validación DOI, borrador Tipado BodyBlock.
Requiere: GEMINI_API_KEY (Google AI Studio, free tier) + LLM_ENABLED=true
No publica solo: guarda en drafts (pending_review) para aprobación humana en /admin/borradores
Docs: scripts/generate-brand.py para brand, public/brand/README.md
"""
import os
import sys
import json
import textwrap
from pathlib import Path

# --- Config ---
LLM_ENABLED = os.environ.get("LLM_ENABLED", "false").lower() == "true"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash-lite")
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or ""
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_KEY") or ""
# Tier permitido: el agente solo propone, editor aprueba
ALLOWED_TIERS = ["Investigación publicada", "Interpretación BiolNexo", "Divulgación científica"]

TEMPLATE_PROMPT = textwrap.dedent("""
Eres redactor científico de BiolNexo (biolnexo@gmail.com).
Objetivo: generar BORRADOR tipado BodyBlock para área {area} en idioma {lang}.

Reglas BiolNexo (inviolables):
- Solo afirma lo que esté en SOURCES con DOI/URL verificable. Si no hay DOI, fuerza tier="Divulgación científica" y disclaimer demo.
- Estructura mínima: 1x h2 introducción, 3-4x p de desarrollo (con datos de SOURCES, sin relleno), 1x list o quote, 1x note de cierre. Opcional table/sequence. No inventes image/table sin fuente.
- BodyBlock usa key "text", nunca "content": {"type": "h2", "text": "..."}, {"type": "p", "text": "..."}.
- SOURCES trae papers reales (doi, title, url, abstract, authors, journal). Resume 1 idea verificable por fuente y cítala en references con su url real.
- PROHIBIDO inventar DOIs o URLs. Si las fuentes no alcanzan, devuelve references: [], source_doi: null y tier "Divulgación científica" (escritura propia del modelo, sin afirmar estudios).
- Tier: "Investigación publicada" solo si DOI resuelve y methodology presente; si no, "Interpretación BiolNexo" o "Divulgación científica".
- Idioma {lang}: todo el borrador en ese idioma. No mezcles.
- Salida: JSON válido con keys {{title, excerpt, category, tier, body: BodyBlock[], references: Reference[], source_doi}} Sin markdown extra.

SOURCES:
{sources_json}

Genera solo JSON. No texto fuera del JSON.
""")

AREA_QUERIES = {
    "biotecnologia": "biotechnology CRISPR gene editing",
    "tendencias": "genomics trends precision medicine",
    "experimentos-caseros": "DNA extraction classroom experiment",
    "software-salud": "digital health mobile app",
}

AREA_QUERIES = {
    # Dos ángulos por área para diversificar institutos/revistas (salud, bio, ingeniería)
    "biotecnologia": ["biotechnology CRISPR gene editing", "synthetic biology bioengineering"],
    "tendencias": ["genomics trends precision medicine", "artificial intelligence drug discovery"],
    "experimentos-caseros": ["DNA extraction classroom experiment", "microscopy citizen science"],
    "software-salud": ["digital health mobile app", "bioinformatics software genomics"],
}

def fetch_openalex(queries, n):
    import urllib.request
    import urllib.parse
    out = []
    for q in queries:
        if len(out) >= n:
            break
        params = urllib.parse.urlencode({
            "search": q,
            "filter": "from_publication_date:2024-01-01,has_doi:true,is_oa:true",
            "per-page": n,
            "select": "doi,title,abstract_inverted_index,primary_location,publication_date,authorships",
            "mailto": "biolnexo@gmail.com",
        })
        try:
            req = urllib.request.Request(
                f"https://api.openalex.org/works?{params}",
                headers={"User-Agent": "BiolNexo/1.0 (mailto:biolnexo@gmail.com)"},
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                payload = json.loads(r.read().decode("utf-8"))
        except Exception as e:
            print(f"[BiolNexo] OpenAlex falló ({e})")
            continue
        for w in payload.get("results", []):
            if len(out) >= n:
                break
            doi = (w.get("doi") or "").replace("https://doi.org/", "")
            if not doi or any(s["doi"] == doi for s in out):
                continue
            inv = w.get("abstract_inverted_index") or {}
            abstract = ""
            if inv:
                pos = {}
                for word, idxs in inv.items():
                    for i in idxs:
                        pos[i] = word
                abstract = " ".join(pos[i] for i in sorted(pos)[:80])
            loc = w.get("primary_location") or {}
            src = loc.get("source") or {}
            url = loc.get("landing_page_url") or w.get("doi") or ""
            authors = ", ".join(a.get("author", {}).get("display_name", "") for a in (w.get("authorships") or [])[:3])
            out.append({
                "doi": doi,
                "title": w.get("title") or "",
                "url": url,
                "abstract": abstract,
                "authors": authors,
                "journal": src.get("display_name") or "",
                "date": w.get("publication_date") or "",
                "origin": "openalex",
            })
    return out

def fetch_semanticscholar(queries, n):
    # Respaldo cuando OpenAlex falla o trae poco: Semantic Scholar (gratis, sin key)
    import urllib.request
    import urllib.parse
    out = []
    for q in queries:
        if len(out) >= n:
            break
        params = urllib.parse.urlencode({
            "query": q,
            "limit": n,
            "fields": "title,abstract,url,authors,year,venue,externalIds,openAccessPdf",
        })
        try:
            req = urllib.request.Request(
                f"https://api.semanticscholar.org/graph/v1/paper/search?{params}",
                headers={"User-Agent": "BiolNexo/1.0 (mailto:biolnexo@gmail.com)"},
            )
            with urllib.request.urlopen(req, timeout=15) as r:
                payload = json.loads(r.read().decode("utf-8"))
        except Exception as e:
            print(f"[BiolNexo] Semantic Scholar falló ({e})")
            continue
        for p in payload.get("data", []):
            if len(out) >= n:
                break
            ext = p.get("externalIds") or {}
            doi = ext.get("DOI") or ""
            if not doi or any(s["doi"] == doi for s in out):
                continue
            url = p.get("url") or (f"https://doi.org/{doi}" if doi else "")
            authors = ", ".join(a.get("name", "") for a in (p.get("authors") or [])[:3])
            pdf = p.get("openAccessPdf") or {}
            out.append({
                "doi": doi,
                "title": p.get("title") or "",
                "url": url,
                "abstract": (p.get("abstract") or "")[:600],
                "authors": authors,
                "journal": p.get("venue") or "",
                "date": str(p.get("year") or ""),
                "pdf": pdf.get("url") or "",
                "origin": "semanticscholar",
            })
    return out

def fetch_sources(area, n=5):
    # Orquestador: OpenAlex (open access, 2024+) primero; si trae poco,
    # completa con Semantic Scholar. Sin fuentes -> lista vacía = Divulgación.
    queries = AREA_QUERIES.get(area, [area])
    out = fetch_openalex(queries, n)
    if len(out) < 2:
        extra = fetch_semanticscholar(queries, n)
        seen = {s["doi"] for s in out}
        for s in extra:
            if s["doi"] not in seen and len(out) < n:
                seen.add(s["doi"])
                out.append(s)
    print(f"[BiolNexo] Fuentes reales totales: {len(out)}")
    return out

def normalize_body_blocks(body):    # Gemini suele devolver {"type","content"}; el frontend (BodyBlock) espera {"type","text"}.
    norm = []
    for b in (body or []):
        if not isinstance(b, dict):
            continue
        t = b.get("type") or "p"
        nb = {"type": t}
        txt = b.get("text", b.get("content", ""))
        if t in ("h2", "p", "quote", "note", "sequence"):
            nb["text"] = txt
            if t == "sequence" and b.get("label"):
                nb["label"] = b["label"]
        elif t == "list":
            items = b.get("items") or []
            if isinstance(items, str):
                items = [items]
            nb["items"] = [str(x) for x in items if str(x).strip()]
        elif t == "image":
            nb["src"] = b.get("src", "")
            if b.get("caption"):
                nb["caption"] = b["caption"]
        elif t == "table":
            nb["header"] = b.get("header") or []
            nb["rows"] = b.get("rows") or []
        else:
            nb["text"] = txt
        norm.append(nb)
    return norm or [{"type": "p", "text": "Contenido generado por agente."}]

def unique_slug(base, lang):
    # Slug único por run: mismo título ya no colisiona (evita error 23505 drafts_slug_key)
    import re
    import random
    from datetime import datetime, timezone
    clean = re.sub(r"[^a-z0-9-]+", "-", (base or "draft").lower())[:40].strip("-") or "draft"
    stamp = datetime.now(timezone.utc).strftime("%y%m%d")
    return f"{clean}-{lang}-{stamp}-{random.randint(1000, 9999)}"[:60].strip("-")

def check_env():
    if not LLM_ENABLED:
        print("[BiolNexo] LLM_ENABLED != true -> modo DRY-RUN, no llama a Gemini. Define LLM_ENABLED=true y GEMINI_API_KEY para activar.")
        return False
    if not GEMINI_API_KEY:
        print("[BiolNexo] Falta GEMINI_API_KEY (aistudio.google.com -> Create API key). Free tier 60 req/min.")
        sys.exit(1)
    return True

def validate_doi(doi: str) -> bool:
    # import leve para no romper dry-run
    try:
        import urllib.request
        url = f"https://doi.org/{doi}"
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.status in (200, 302)
    except Exception:
        return False

def generate_draft(area: str, lang: str, sources_json: str):
    enabled = check_env()
    if not enabled:
        # mock borrador para validar pipeline sin coste
        mock = {
            "title": f"[MOCK] {area} — borrador {lang}",
            "excerpt": "Borrador de demostración BiolNexo sin LLM (LLM_ENABLED=false).",
            "category": area,
            "tier": "Divulgación científica",
            "body": [
                {"type": "h2", "text": "Introducción"},
                {"type": "p", "text": "Este es un borrador mock generado sin Gemini. Activa LLM_ENABLED=true para generación real."},
                {"type": "note", "text": "Contenido de demostración BiolNexo: validar DOI antes de aprobar."}
            ],
            "references": [{"text": "Demo ref", "url": "https://doi.org/10.5281/biolnexo.demo.0000"}],
            "source_doi": "10.5281/biolnexo.demo.0000"
        }
        print(json.dumps(mock, ensure_ascii=False, indent=2))
        return mock

    # --- LLM real (corregido vs snippet inicial) ---
    from google import genai
    from google.genai import types

    # Modelos disponibles según ListModels v1: 2.5-flash, 2.5-pro, 2.5-flash-lite, 2.5-flash-image, 3.1-flash-lite, 3-pro-image (1.5 ya no para nuevos)
    from google.genai import types as gtypes
    candidates_api = [
        ("v1", [MODEL, "gemini-2.5-flash-lite", "gemini-2.5-pro", "gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.5-flash-image", "gemini-3-pro-image", "gemma-4-26b-a4b-it"]),
        ("v1beta", [MODEL, "gemini-2.5-flash-lite", "gemini-1.5-flash", "gemini-2.5-flash"]),
    ]
    # deduplica por api_version+model
    resp = None
    last_err = None
    # Primero intenta listar modelos disponibles para debug
    for api_ver in ["v1", "v1beta"]:
        try:
            tmp_client = genai.Client(api_key=GEMINI_API_KEY, http_options=gtypes.HttpOptions(api_version=api_ver))
            listed = list(tmp_client.models.list())
            print(f"[BiolNexo] Modelos disponibles en {api_ver}: {[m.name for m in listed[:8]]}")
            break
        except Exception as e:
            print(f"[BiolNexo] No se pudo listar modelos {api_ver}: {e}")

    # Si vienen sources demo (como las del workflow por defecto), intenta
    # reemplazarlas por papers reales de OpenAlex antes de llamar al modelo.
    try:
        parsed_sources = json.loads(sources_json or "[]")
    except Exception:
        parsed_sources = []
    if not parsed_sources or "biolnexo.demo" in json.dumps(parsed_sources):
        real = fetch_sources(area)
        if real:
            sources_json = json.dumps(real, ensure_ascii=False)

    prompt = TEMPLATE_PROMPT.format(area=area, lang=lang, sources_json=sources_json)
    for api_ver, models in candidates_api:
        client = genai.Client(api_key=GEMINI_API_KEY, http_options=gtypes.HttpOptions(api_version=api_ver))
        # deduplica
        seen=set(); uniq=[]
        for m in models:
            if m not in seen:
                seen.add(m); uniq.append(m)
        for m in uniq:
            if resp is not None:
                break
            for with_search in [True, False]:
                if resp is not None:
                    break
                try:
                    print(f"[BiolNexo] Probando {api_ver} / {m} {'+search' if with_search else ''}...")
                    cfg = gtypes.GenerateContentConfig(
                        temperature=0.4,
                        max_output_tokens=2048,
                        top_p=0.95,
                    )
                    if with_search:
                        cfg.tools = [gtypes.Tool(google_search=gtypes.GoogleSearch())]
                    resp = client.models.generate_content(model=m, contents=prompt, config=cfg)
                    print(f"[BiolNexo] Modelo OK: {api_ver}/{m}")
                    break
                except Exception as e:
                    msg = str(e)
                    last_err = e
                    if "404" in msg or "NOT_FOUND" in msg or "not found" in msg.lower():
                        print(f"[BiolNexo] {m} no disponible ({msg[:120]})")
                        continue
                    print(f"[BiolNexo] Error {m}: {msg[:200]}")
                    continue
        if resp is not None:
            break
    if resp is None:
        print(f"[BiolNexo] Ningún modelo disponible. Último error: {last_err}")
        print("→ En AI Studio prueba gemini-1.5-flash y verifica que la API key sea de un proyecto con Generative Language API habilitada. Si tu proyecto es nuevo, puede que solo tenga gemini-3.x via Interactions API.")
        sys.exit(3)
    text = (resp.text or "").strip()
    # intenta extraer JSON
    try:
        # Gemini a veces envuelve en ```json
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()
        data = json.loads(text)
    except Exception as e:
        print("[BiolNexo] Respuesta no JSON, guardando raw:", e)
        print(text[:4000])
        sys.exit(2)

    # validación DOI antes de guardar como draft
    doi = data.get("source_doi") or (data.get("references") or [{}])[0].get("url","").split("doi.org/")[-1]
    if doi and not validate_doi(doi):
        print(f"[BiolNexo] DOI no resuelve ({doi}) -> fuerza Divulgacion y disclaimer")
        data["tier"] = "Divulgación científica"

    print(json.dumps(data, ensure_ascii=False, indent=2))
    # Normaliza al esquema que espera el frontend/admin antes de insertar
    data["body"] = normalize_body_blocks(data.get("body", []))
    # Inserta en Supabase drafts (requiere SUPABASE_SERVICE_ROLE_KEY)
    if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
        try:
            from supabase import create_client
            supa = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
            slug = unique_slug(data.get("slug") or data.get("title", "draft"), lang)
            payload = {
                "area_slug": area,  # slug válido del CLI; el texto libre del modelo ("Biotecnología") rompería la FK de articles al aprobar
                "lang": lang,
                "tier": data.get("tier") or "Divulgación científica",
                "title": data.get("title"),
                "slug": slug,
                "excerpt": data.get("excerpt","")[:300],
                "body_json": data.get("body", []),
                "references": data.get("references", []),
                "source_doi": data.get("source_doi"),
                "status": "pending_review",
            }
            try:
                res = supa.table("drafts").insert(payload).execute()
            except Exception as e:
                if "23505" in str(e) or "duplicate" in str(e).lower():
                    # Colisión residual: regenera slug y reintenta una vez
                    payload["slug"] = unique_slug(data.get("title", "draft"), lang)
                    res = supa.table("drafts").insert(payload).execute()
                    slug = payload["slug"]
                else:
                    raise
            print(f"[BiolNexo] Draft insertado en Supabase: {slug} -> /admin/borradores")
        except Exception as e:
            print(f"[BiolNexo] No se pudo insertar en Supabase (modo log): {e}")
    else:
        print("[BiolNexo] Sin SUPABASE_SERVICE_ROLE_KEY -> solo log, no inserta. Configura en GitHub Secrets para 3×/semana.")
    return data

if __name__ == "__main__":
    # Uso: LLM_ENABLED=true GEMINI_API_KEY=xxx python scripts/agent_draft.py --area biotecnologia --lang es
    import argparse
    ap = argparse.ArgumentParser(description="BiolNexo agent draft")
    ap.add_argument("--area", default="biotecnologia", choices=["biotecnologia","tendencias","experimentos-caseros","software-salud"])
    ap.add_argument("--lang", default="es", choices=["es","en"])
    ap.add_argument("--sources", default="[]", help="JSON array string de sources con doi/url")
    args = ap.parse_args()
    generate_draft(args.area, args.lang, args.sources or '[{"doi":"10.5281/biolnexo.demo.0001","title":"Demo"}]')
