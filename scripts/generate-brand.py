#!/usr/bin/env python3
# Generate BiolNexo brand assets for Facebook profile & cover
import math, pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

# Colors
NAVY = (7, 26, 46)
NAVY2 = (11, 37, 64)
PRIMARY = (14, 78, 140)
AQUA = (15, 168, 192)
AQUA_SOFT = (224, 244, 248)
BIO = (46, 196, 138)
PAPER = (244, 247, 250)
WHITE = (255,255,255)

def hexagon_points(cx, cy, r):
    pts = []
    for i in range(6):
        ang = math.radians(60*i - 30)  # flat top
        pts.append((cx + r*math.cos(ang), cy + r*math.sin(ang)))
    return pts

def draw_logo(draw, cx, cy, r):
    # hexagon filled
    pts = hexagon_points(cx, cy, r)
    draw.polygon(pts, fill=PRIMARY, outline=AQUA, width=max(3, int(r*0.04)))
    # inner stroke light
    # diagonal line
    # approximate first line: from near top left to center to bottom right
    x1 = cx - r*0.42
    y1 = cy - r*0.33
    x2 = cx
    y2 = cy + r*0.02
    x3 = cx + r*0.42
    y3 = cy + r*0.33
    draw.line([(x1,y1),(x2,y2),(x3,y3)], fill=(244,247,250), width=max(2,int(r*0.045)))
    # second curved line approximated as polyline
    cx2 = cx + r*0.55
    cy2 = cy - r*0.15
    # small curve points
    draw.line([(x1, y1+ r*0.45),(cx- r*0.05, cy+ r*0.22),(x3, y3- r*0.18)], fill=AQUA, width=max(2,int(r*0.035)))
    # circles
    for (ox, oy), col in [((x1,y1), WHITE), ((x2,y2), AQUA), ((x3,y3), BIO)]:
        cr = r*0.075
        draw.ellipse([ox-cr, oy-cr, ox+cr, oy+cr], fill=col, outline=None)

def load_font(size, bold=False):
    # try arial
    try:
        name = "arialbd.ttf" if bold else "arial.ttf"
        p = pathlib.Path("C:/Windows/Fonts") / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    except: pass
    try:
        return ImageFont.truetype("arial.ttf", size)
    except:
        return ImageFont.load_default()

# --- PROFILE 1024 ---
for sz in [1024, 512]:
    im = Image.new("RGB", (sz, sz), NAVY)
    d = ImageDraw.Draw(im)
    # subtle radial glow
    # draw large translucent circles for glow
    glow_r = int(sz*0.42)
    for i in range(3):
        alpha = 22 - i*7
        # create overlay for glow
        overlay = Image.new("RGBA", (sz,sz), (0,0,0,0))
        od = ImageDraw.Draw(overlay)
        rad = glow_r - i*30
        od.ellipse([sz//2 - rad, sz//2 - rad, sz//2 + rad, sz//2 + rad], fill=(15,168,192, alpha))
        im = Image.alpha_composite(im.convert("RGBA"), overlay).convert("RGB")
        d = ImageDraw.Draw(im)
    r = int(sz*0.28)
    draw_logo(d, sz//2, sz//2 - 10, r)
    # no wordmark for profile (pure mark) - add tiny wordmark at bottom for fallback?
    out_png = OUT / f"biolnexo-profile-{sz}.png"
    out_webp = OUT / f"biolnexo-profile-{sz}.webp"
    im.save(out_png, "PNG", optimize=True)
    im.save(out_webp, "WEBP", quality=90, method=4)
    print(f"profile {sz} -> {out_png}")

# --- PROFILE with wordmark variant (for docs) ---
im = Image.new("RGB", (1024, 1024), NAVY)
d = ImageDraw.Draw(im)
r = int(1024*0.22)
draw_logo(d, 512, 420, r)
# wordmark
font_big = load_font(92, bold=True)
font_mono = load_font(22)
# measure
text = "BiolNexo"
# we want Biol in white, Nexo in aqua -> draw two parts
# use textbbox
try:
    bbox_biol = d.textbbox((0,0), "Biol", font=font_big)
    w_biol = bbox_biol[2]-bbox_biol[0]
    bbox_nexo = d.textbbox((0,0), "Nexo", font=font_big)
    w_nexo = bbox_nexo[2]-bbox_nexo[0]
    w_total = w_biol + w_nexo
    x0 = 512 - w_total//2
    y0 = 690
    d.text((x0, y0), "Biol", font=font_big, fill=WHITE)
    d.text((x0 + w_biol, y0), "Nexo", font=font_big, fill=AQUA)
    # tagline
    tag = "Ciencia  •  Tecnología  •  Ingeniería"
    bbox_tag = d.textbbox((0,0), tag, font=font_mono)
    w_tag = bbox_tag[2]-bbox_tag[0]
    d.text((512 - w_tag//2, 795), tag, font=font_mono, fill=(159,180,202))
except Exception as e:
    print(e)
im.save(OUT / "biolnexo-profile-wordmark-1024.png", "PNG")
im.save(OUT / "biolnexo-profile-wordmark-1024.webp", "WEBP", quality=90)
print("profile wordmark done")

# --- COVER 1640 x 924 (Facebook) ---
W, H = 1640, 924
im = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(im)
# navy left wash
# left navy panel 38% width with rounded? simple rect
left_w = int(W*0.42)
# gradient-like left navy
d.rectangle([0,0,left_w, H], fill=NAVY)
# subtle dots on navy (grid)
for x in range(0, left_w, 24):
    for y in range(0, H, 24):
        d.ellipse([x-1, y-1, x+1, y+1], fill=(126,187,231, 18))
# glow on navy
overlay = Image.new("RGBA", (W,H), (0,0,0,0))
od = ImageDraw.Draw(overlay)
od.ellipse([left_w-260, H//2 -260, left_w+260, H//2+260], fill=(15,168,192, 28))
im = Image.alpha_composite(im.convert("RGBA"), overlay).convert("RGB")
d = ImageDraw.Draw(im)
# logo on left
draw_logo(d, left_w//2, H//2 - 20, 160)
# wordmark on right
font_big = load_font(96, bold=True)
font_big2 = load_font(96, bold=True)
font_sub = load_font(18)
font_tag = load_font(20)

# BiolNexo on right
try:
    x_right = left_w + 80
    y_title = 320
    # Biol in navy, Nexo in primary
    bbox_biol = d.textbbox((0,0), "Biol", font=font_big)
    w_biol = bbox_biol[2]-bbox_biol[0]
    bbox_nexo = d.textbbox((0,0), "Nexo", font=font_big2)
    d.text((x_right, y_title), "Biol", font=font_big, fill=NAVY)
    d.text((x_right + w_biol, y_title), "Nexo", font=font_big2, fill=PRIMARY)
    # tagline
    tag = "Ciencia  •  Tecnología  •  Ingeniería"
    d.text((x_right, y_title+115), tag, font=font_tag, fill=(92,112,134))
    # lead
    lead = "Conectamos conocimiento, datos y tecnología"
    lead2 = "para comprender la ciencia."
    font_lead = load_font(24)
    d.text((x_right, y_title+175), lead, font=font_lead, fill=(49,70,91))
    d.text((x_right, y_title+210), lead2, font=font_lead, fill=(49,70,91))
    # small footer line
    d.rectangle([x_right, H-110, x_right+420, H-108], fill=(220,229,238))
    d.text((x_right, H-85), "biolnexo@gmail.com", font=font_sub, fill=(14,78,140))
    d.text((x_right+220, H-85), "  •  bionexo.demo → biolnexo", font=font_sub, fill=(92,112,134))
except Exception as e:
    print("cover text error", e)

im.save(OUT / "biolnexo-cover-1640x924.png", "PNG", optimize=True)
im.save(OUT / "biolnexo-cover-1640x924.webp", "WEBP", quality=90, method=4)
print("cover 1640x924 done")

# also 820x312 variant
im2 = im.resize((820,462), Image.LANCZOS)
im2.save(OUT / "biolnexo-cover-820x462.png", "PNG")
im2.save(OUT / "biolnexo-cover-820x462.webp", "WEBP", quality=90)
print("cover 820 done")

# --- SVG master ---
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="BiolNexo">
  <path d="M16 2.5l11.26 6.5v13L16 28.5 4.74 22V9L16 2.5z" fill="#0E4E8C"/>
  <path d="M16 2.5l11.26 6.5v13L16 28.5 4.74 22V9L16 2.5z" stroke="#0FA8C0" stroke-opacity="0.55" stroke-width="1.2" fill="none"/>
  <path d="M10.5 11.5l5.5 4 5.5 4" stroke="#F4F7FA" stroke-width="1.4" fill="none"/>
  <path d="M10.5 20.5c3.6-1.2 7.4-1.2 11-6.5" stroke="#0FA8C0" stroke-width="1.1" stroke-opacity="0.8" fill="none"/>
  <circle cx="10.5" cy="11.5" r="2" fill="#F4F7FA"/>
  <circle cx="16" cy="15.5" r="2" fill="#0FA8C0"/>
  <circle cx="21.5" cy="19.5" r="2" fill="#2EC48A"/>
</svg>'''
(OUT / "biolnexo-logo-mark.svg").write_text(svg, encoding="utf-8")
# wordmark svg
svg2 = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 80" role="img" aria-label="BiolNexo">
  <g font-family="Space Grotesk, sans-serif" font-weight="700" font-size="48">
    <text x="84" y="54" fill="#0B1C2C">Biol<tspan fill="#0E4E8C">Nexo</tspan></text>
  </g>
  <g font-family="IBM Plex Mono, monospace" font-size="10" letter-spacing="3">
    <text x="84" y="72" fill="#0FA8C0">CIENCIA • TECNOLOGÍA • INGENIERÍA</text>
  </g>
  <!-- mark -->
  <g transform="translate(8,8) scale(1.9)">
    <path d="M16 2.5l11.26 6.5v13L16 28.5 4.74 22V9L16 2.5z" fill="#0E4E8C"/>
    <path d="M10.5 11.5l5.5 4 5.5 4" stroke="#F4F7FA" stroke-width="1.4" fill="none"/>
    <circle cx="10.5" cy="11.5" r="2" fill="#F4F7FA"/>
    <circle cx="16" cy="15.5" r="2" fill="#0FA8C0"/>
    <circle cx="21.5" cy="19.5" r="2" fill="#2EC48A"/>
  </g>
</svg>'''
(OUT / "biolnexo-logo-full.svg").write_text(svg2, encoding="utf-8")
print("svg done")
# list
for p in sorted(OUT.glob("*")):
    print(f"{p.name} {p.stat().st_size/1024:.1f} KB")
