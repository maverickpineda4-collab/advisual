# ADVISUAL — Sitio web oficial

Landing page de la productora audiovisual **Advisual**: reels, videoclips, videos corporativos y cobertura de eventos.

Hecha con **HTML5 + CSS3 moderno + JavaScript vanilla** (sin frameworks), comentada línea por línea en español para que entiendas cada decisión.

---

## 📁 Estructura del proyecto

```
advisual/
├── index.html          → La ESTRUCTURA: textos, títulos, secciones (el "esqueleto")
├── css/
│   └── styles.css      → Los ESTILOS: colores, tamaños, animaciones, responsive (la "pintura")
├── js/
│   └── main.js         → La INTERACTIVIDAD: menú móvil, contadores, filtros, carrusel (la "electricidad")
├── assets/
│   ├── img/            → Aquí van tu logo y las miniaturas del portafolio
│   └── video/          → Aquí va hero.mp4 (el video de la portada)
├── favicon.svg         → Iconito de la pestaña del navegador (temporal)
└── package.json        → Configuración del servidor de desarrollo (Vite)
```

## ▶️ Cómo ver la página mientras la editamos

```bash
cd advisual
npm install     # solo la primera vez
npm run dev     # arranca el servidor de desarrollo
```

Abre la dirección que aparece en la terminal (ej. `http://localhost:5173`).
Cada vez que guardes un cambio en VS Code, la página se recarga sola (hot reload).

> También puedes simplemente hacer doble clic en `index.html` y se abrirá en el navegador,
> sin servidor. Pero con `npm run dev` la experiencia de edición es mejor.

## 🛠️ Guía de trabajo (nuestro paso a paso)

| Fase | Qué hacemos | Estado |
|---|---|---|
| **1. Estructura y diseño base** ✅ | HTML + CSS + JS completos, diseño oscuro elegante, video, animaciones | **Hecho (v1)** |
| **2. Identidad de marca** | Me mandas logo, colores oficiales y tipografía si tienes; los integramos | Pendiente |
| **3. Contenido real** | Tus textos, servicios reales, precios/planes si quieres, fotos y miniaturas del portafolio | Pendiente |
| **4. Video hero** | Me pasas tu mejor clip (5–15 s) y lo ponemos de fondo en la portada | Pendiente |
| **5. Contacto real** | Tu número de WhatsApp, correo, redes; cuenta gratuita en Formspree para el formulario | Pendiente |
| **6. Publicación** | Conectar el dominio `advisual` a Cloudflare Pages / Netlify (gratis, con HTTPS) | Pendiente |
| **7. SEO y extras** | Meta etiquetas, Google Analytics, sitemap, Open Graph (cómo se ve al compartir el link) | Pendiente |
| **8. Backend (futuro, solo si lo necesitas)** | Blog, agenda de reservas, panel de clientes | A evaluar |

## ✏️ Cosas que puedes personalizar ya (busca y reemplaza)

| Qué | Dónde | Busca |
|---|---|---|
| Número de WhatsApp | `index.html` y `js/main.js` | `56912345678` |
| Correo de contacto | `index.html` (sección contacto) | `contacto@advisual.cl` |
| Colores de marca | `css/styles.css` (arriba, en `:root`) | `--acento` y `--acento-2` |
| Cifras de los contadores | `index.html` (sección cifras) | `data-meta` |
| Formulario por correo | `index.html` (form) | `TU_ID` (créalo gratis en formspree.io) |

## 🚀 Publicación (cuando lleguemos a la fase 6)

1. `npm run build` → genera la carpeta `dist/` con la versión optimizada.
2. Subimos `dist/` a **Cloudflare Pages** o **Netlify** (gratis).
3. En el panel de tu dominio apuntamos los DNS — yo te guío paso a paso.
