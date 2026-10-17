# ══════════════════════════════════════════════════════════════
# Script único de marca: prepara los logos elegidos para la web
# (optimiza tamaños y fabrica el favicon). Se ejecuta UNA vez.
# ══════════════════════════════════════════════════════════════
from PIL import Image, ImageDraw  # Pillow: la librería estándar de Python para imágenes
from pathlib import Path

ORIGEN = Path("assets/logo-candidatos")   # Aquí están los 14 candidatos
DESTINO = Path("assets/img")              # Aquí quedarán los archivos finales de la web
DESTINO.mkdir(parents=True, exist_ok=True)

# ── 1. Verificar que los PNG elegidos SÍ tienen canal alfa (transparencia) ──
for nombre in ["1.png", "2.png", "3.png", "4.png"]:
    img = Image.open(ORIGEN / nombre)
    print(f"{nombre}: modo={img.mode}, tamaño={img.size}")  # modo "RGBA" = con transparencia ✅

# ── 2. Optimizar los logos para web ──
# Un logo de 5851px pesa demasiado para una barra de navegación.
# Lo bajamos a 1200px de ancho: suficiente para pantallas retina, ~10x más liviano.
def optimizar(nombre_origen, nombre_destino, ancho_max=1200):
    img = Image.open(ORIGEN / nombre_origen).convert("RGBA")
    if img.width > ancho_max:  # Solo reducimos si es más grande de lo necesario
        alto_nuevo = round(img.height * ancho_max / img.width)  # Mantiene la proporción
        img = img.resize((ancho_max, alto_nuevo), Image.LANCZOS)  # LANCZOS = el mejor algoritmo de reducción
    img.save(DESTINO / nombre_destino, optimize=True)
    print(f"✅ {nombre_destino}: {img.size}")

optimizar("3.png", "logo-blanco.png")     # Nav + footer (fondo oscuro)
optimizar("4.png", "logo-negro.png")      # Reserva para fondos claros
optimizar("1.png", "isotipo-blanco.png", ancho_max=800)  # Símbolo AV blanco
optimizar("2.png", "isotipo-negro.png", ancho_max=800)   # Símbolo AV negro

# ── 3. Fabricar el favicon: isotipo blanco sobre cuadro oscuro redondeado ──
LADO = 512                          # Tamaño estándar de favicon moderno
favicon = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))  # Lienzo transparente
dibujo = ImageDraw.Draw(favicon)
dibujo.rounded_rectangle([0, 0, LADO, LADO], radius=110, fill=(11, 11, 18, 255))  # Fondo #0b0b12

isotipo = Image.open(ORIGEN / "1.png").convert("RGBA")
escala = (LADO * 0.62) / isotipo.width                 # El isotipo ocupará el 62% del cuadro
isotipo = isotipo.resize((round(isotipo.width * escala), round(isotipo.height * escala)), Image.LANCZOS)
pos_x = (LADO - isotipo.width) // 2   # Centrado horizontal
pos_y = (LADO - isotipo.height) // 2  # Centrado vertical
favicon.paste(isotipo, (pos_x, pos_y), isotipo)        # El 3er argumento = usar su transparencia como máscara
favicon.save(DESTINO / "favicon.png")
print(f"✅ favicon.png: {favicon.size}")

print("\nListo: archivos finales en assets/img/")
