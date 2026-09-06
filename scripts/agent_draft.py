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
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
# Tier permitido: el agente solo propone, editor aprueba
ALLOWED_TIERS = ["Investigación publicada", "Interpretación BiolNexo", "Divulgación científica"]

TEMPLATE_PROMPT = textwrap.dedent("""
Eres redactor científico de BiolNexo (biolnexo@gmail.com).
Objetivo: generar BORRADOR tipado BodyBlock para área {area} en idioma {lang}.

Reglas BiolNexo (inviolables):
- Solo afirma lo que esté en SOURCES con DOI/URL verificable. Si no hay DOI, fuerza tier="Divulgación científica" y disclaimer demo.
- Estructura: 1x h2 introducción, 2-4x p, 1x list o quote, opcional table/sequence/note. No inventes image/table sin fuente.
- Referencias: array con {{text, url}} exactamente de SOURCES. Verifica que url responde 200.
- Tier: "Investigación publicada" solo si DOI resuelve y methodology presente; si no, "Interpretación BiolNexo" o "Divulgación científica".
- Idioma {lang}: todo el borrador en ese idioma. No mezcles.
- Salida: JSON válido con keys {{title, excerpt, category, tier, body: BodyBlock[], references: Reference[], source_doi}} Sin markdown extra.

SOURCES:
{sources_json}

Genera solo JSON. No texto fuera del JSON.
""")

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

    client = genai.Client(api_key=GEMINI_API_KEY)

    prompt = TEMPLATE_PROMPT.format(area=area, lang=lang, sources_json=sources_json)

    # Correción clave vs snippet inicial:
    # - model: gemini-2.0-flash (no gemini-3-flash-preview)
    # - tools: types.Tool(google_search=...) (no {'type':'google_search'})
    # - config: types.GenerateContentConfig (no generation_config dict)
    # - temperature 0.4 para rigor (no 1), max_output_tokens 2048 (no 65536)
    resp = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.4,
            max_output_tokens=2048,
            top_p=0.95,
            tools=[types.Tool(google_search=types.GoogleSearch())],
            # thinking_config solo en 2.5; omitir en Flash free
        ),
    )
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
    # aquí iría: supabase.table("drafts").insert({... , status="pending_review"}).execute()
    # 3×/semana se orquesta via Supabase Cron / Vercel Cron lunes/miércoles/viernes 06:00 UTC
    return data

if __name__ == "__main__":
    # Uso: LLM_ENABLED=true GEMINI_API_KEY=xxx python scripts/agent_draft.py --area bioinformatica --lang es
    import argparse
    ap = argparse.ArgumentParser(description="BiolNexo agent draft")
    ap.add_argument("--area", default="bioinformatica", choices=["biologia","bioinformatica","biotecnologia","ia-cientifica","ecologia","tecnologia","ciencia-datos","investigacion"])
    ap.add_argument("--lang", default="es", choices=["es","en"])
    ap.add_argument("--sources", default="[]", help="JSON array string de sources con doi/url")
    args = ap.parse_args()
    generate_draft(args.area, args.lang, args.sources or '[{"doi":"10.5281/biolnexo.demo.0001","title":"Demo"}]')
