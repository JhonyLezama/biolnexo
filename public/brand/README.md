# BiolNexo — Brand Kit

Carpeta con logo en PNG / WebP + SVG para Facebook y web.

## Archivos

| Archivo | Uso | Tamaño |
|---|---|---|
| `biolnexo-logo-mark.svg` | Icono solo (hexágono) vectorial | 32×32 viewBox |
| `biolnexo-logo-full.svg` | Logo completo + wordmark + tagline | 420×80 viewBox |
| `biolnexo-profile-1024.png` / `.webp` | **Foto de perfil Facebook** (recomendado 1024) | 1024×1024 |
| `biolnexo-profile-512.png` / `.webp` | Perfil fallback / favicon | 512×512 |
| `biolnexo-profile-wordmark-1024.png` | Variante perfil con texto | 1024×1024 |
| `biolnexo-cover-1640x924.png` / `.webp` | **Portada Facebook** (1640×924) | 1640×924 |
| `biolnexo-cover-820x462.png` | Portada 820 (fallback) | 820×462 |

Colores: `Navy #071A2E`, `Primary #0E4E8C`, `Aqua #0FA8C0`, `Bio #2EC48A`, `Paper #F4F7FA`.

## Uso en Facebook
* **Perfil:** subir `biolnexo-profile-1024.png` (Facebook lo recorta circular)
* **Portada:** subir `biolnexo-cover-1640x924.png` — ya incluye wordmark “BiolNexo” + “Ciencia • Tecnología • Ingeniería” + `biolnexo@gmail.com`

## Generación
```bash
python3 scripts/generate-brand.py
```
Requiere `Pillow` (`pip install Pillow`).
