/* ════════════════════════════════════════════════════════════════════
   ADVISUAL — JavaScript principal
   El JS es la "electricidad" de la página: todo lo que SE MUEVE o
   RESPONDE cuando el usuario hace algo (clics, scroll, etc.).
   ════════════════════════════════════════════════════════════════════ */

"use strict"; // Modo estricto: el navegador nos avisa de errores que normalmente pasaría por alto (buena práctica)

/* Esperamos a que el HTML termine de cargarse antes de tocar nada.
   Sin esto, el JS podría buscar un botón que aún no existe. */
document.addEventListener("DOMContentLoaded", () => {

    /* ──────────────────────────────────────────────
       1. ANIMACIONES AL HACER SCROLL (librería AOS)
       Lee los atributos data-aos="..." del HTML y anima
       cada elemento cuando entra en pantalla.
       ────────────────────────────────────────────── */
    AOS.init({
        duration: 800,   // Cada animación dura 0,8 segundos
        once: true,      // Solo la PRIMERA vez (no se repite al subir y bajar)
        offset: 80,      // Arranca cuando el elemento está a 80px de ser visible
    });

    /* ──────────────────────────────────────────────
       2. AÑO AUTOMÁTICO EN EL FOOTER
       Escribe el año actual para que el © nunca quede viejo.
       ────────────────────────────────────────────── */
    document.getElementById("anioActual").textContent = new Date().getFullYear();

    /* ──────────────────────────────────────────────
       3. NAV QUE SE VUELVE "DE VIDRIO" AL BAJAR
       Cuando el usuario baja más de 40px, le ponemos
       la clase .nav--solido (definida en el CSS).
       ────────────────────────────────────────────── */
    const nav = document.getElementById("nav"); // Buscamos la barra de navegación por su id

    window.addEventListener("scroll", () => {
        // Si bajamos más de 40px → agrega la clase; si volvemos arriba → la quita
        nav.classList.toggle("nav--solido", window.scrollY > 40);
    });

    /* ──────────────────────────────────────────────
       4. MENÚ HAMBURGUESA (móvil)
       Abre/cierra el panel de enlaces y transforma el ☰ en ✕
       ────────────────────────────────────────────── */
    const botonMenu = document.getElementById("botonMenu");
    const menuMovil = document.getElementById("menuMovil");

    botonMenu.addEventListener("click", () => {
        menuMovil.classList.toggle("abierto");   // Muestra/oculta el panel lateral
        botonMenu.classList.toggle("abierto");   // Anima el ☰ a ✕ (ver CSS sección 16)
    });

    // Al tocar cualquier enlace del menú móvil, el panel se cierra solo
    menuMovil.querySelectorAll(".nav__link").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            menuMovil.classList.remove("abierto");
            botonMenu.classList.remove("abierto");
        });
    });

    /* (La sección 5 de contadores animados se eliminó junto con la
       sección de cifras: solo mostraremos números reales y verificables) */

    /* ──────────────────────────────────────────────
       6. FILTRO DEL PORTAFOLIO
       Al hacer clic en "Reels", por ejemplo, mostramos
       solo los proyectos con data-categoria="reels".
       ────────────────────────────────────────────── */
    const botonesFiltro = document.querySelectorAll(".filtro");
    const proyectos = document.querySelectorAll(".proyecto");

    botonesFiltro.forEach((boton) => {
        boton.addEventListener("click", () => {
            // Marcamos visualmente el botón presionado (y desmarcamos los demás)
            botonesFiltro.forEach((b) => b.classList.remove("activo"));
            boton.classList.add("activo");

            const categoria = boton.dataset.filtro; // "todos", "reels", "videoclips"...

            proyectos.forEach((proyecto) => {
                const coincide = categoria === "todos" || proyecto.dataset.categoria === categoria;
                proyecto.classList.toggle("oculto", !coincide); // .oculto = display:none (ver CSS)
            });
        });
    });

    /* ──────────────────────────────────────────────
       6b. FILTROS DEL CATÁLOGO DE PRECIOS
       Misma lógica del portafolio, pero con clases propias
       (.filtro-precio / .tarifa) para que ambos filtros
       funcionen de forma independiente y no se pisen.
       ────────────────────────────────────────────── */
    const botonesPrecio = document.querySelectorAll(".filtro-precio");
    const tarifas = document.querySelectorAll(".tarifa");

    botonesPrecio.forEach((boton) => {
        boton.addEventListener("click", () => {
            // Marcamos visualmente el botón presionado
            botonesPrecio.forEach((b) => b.classList.remove("activo"));
            boton.classList.add("activo");

            const categoria = boton.dataset.filtro; // "todos", "negocios", "eventos", "material"

            tarifas.forEach((tarifa) => {
                // data-cat puede tener VARIAS categorías separadas por espacio
                const coincide = categoria === "todos" || tarifa.dataset.cat.split(" ").includes(categoria);
                tarifa.classList.toggle("oculto", !coincide);
            });
        });
    });

    /* ──────────────────────────────────────────────
       6c. PREVIEW AL PASAR EL MOUSE (estilo Netflix)
       Al posar el mouse sobre una tarjeta con video real,
       reproducimos el video SILENCIADO y en bucle sobre la
       miniatura; al salir, vuelve la imagen de portada.
       Solo en dispositivos con mouse real (hover) y si el
       usuario no pidió "reducir movimiento" en su sistema.
       ────────────────────────────────────────────── */
    const tieneMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (tieneMouse && !reduceMovimiento) {
        document.querySelectorAll(".proyecto[data-video]").forEach((tarjeta) => {
            const miniatura = tarjeta.querySelector(".proyecto__miniatura");
            if (!miniatura) return;

            let video = null;        // El <video> se crea solo la PRIMERA vez que se hace hover
            let temporizador = null; // Retraso para no descargar videos al pasar el mouse rápido

            tarjeta.addEventListener("mouseenter", () => {
                temporizador = setTimeout(() => {
                    if (!video) {
                        video = document.createElement("video");
                        video.className = "proyecto__preview";
                        video.muted = true;      // Mudo: los navegadores SOLO permiten autoplay sin sonido
                        video.loop = true;       // Bucle infinito mientras el mouse esté encima
                        video.playsInline = true;
                        video.preload = "auto";  // Descarga progresiva (no espera el archivo completo)
                        video.src = tarjeta.dataset.video; // El mismo video del visor modal
                        miniatura.appendChild(video);
                        // Cuando hay suficiente video cargado, aparece con un fundido suave
                        video.addEventListener("canplay", () => video.classList.add("visible"));
                    }
                    video.play().catch(() => {}); // El catch evita errores si el navegador bloquea el play
                    if (video.readyState >= 3) video.classList.add("visible"); // Ya estaba cargado de un hover anterior
                }, 300); // 300 ms: si solo pasabas de largo, no gasta datos
            });

            tarjeta.addEventListener("mouseleave", () => {
                clearTimeout(temporizador); // Cancela el preview si aún no partía
                if (video) {
                    video.pause();
                    video.classList.remove("visible"); // Vuelve la portada con fundido
                }
            });
        });
    }

    /* ──────────────────────────────────────────────
       7. FORMULARIO DE CONTACTO (doble vía)
       a) CORREO: cuando pongas tu ID de Formspree en el action
          del <form>, enviamos los datos por fetch (sin salir de
          la página) y llegan al correo de Advisual.
       b) WHATSAPP: además se ofrece avisar por WhatsApp con el
          mensaje ya escrito (el cliente solo aprieta "enviar").
          Mientras no haya ID de Formspree, se usa SOLO WhatsApp.
       ────────────────────────────────────────────── */
    const formulario = document.getElementById("formContacto");
    const nota = document.getElementById("notaFormulario");

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault(); // Siempre manejamos el envío nosotros (sin recargar la página)

        // Leemos lo que escribió el visitante
        const nombre  = document.getElementById("nombre").value;
        const correo  = document.getElementById("email").value;
        const tipo    = document.getElementById("tipo").value;
        const mensaje = document.getElementById("mensaje").value;

        // Armamos el texto de WhatsApp. encodeURIComponent convierte espacios y
        // tildes en un formato seguro para URLs (%20, %C3%A9, etc.)
        const texto = encodeURIComponent(
            `Hola Advisual 👋 Soy ${nombre} (${correo}). Me interesa: ${tipo}. ${mensaje}`
        );
        const linkWhatsApp = `https://wa.me/56953334461?text=${texto}`;

        // ¿El action todavía tiene el texto de relleno "TU_ID"?
        const formularioSinConfigurar = formulario.action.includes("TU_ID");

        if (formularioSinConfigurar) {
            // MODO ACTUAL: solo WhatsApp (aún no hay correo configurado)
            window.open(linkWhatsApp, "_blank");
            nota.textContent = "✅ Te abrimos WhatsApp con tu mensaje listo para enviar.";
            return;
        }

        // MODO COMPLETO: enviar al correo vía Formspree
        nota.textContent = "Enviando...";
        try {
            const respuesta = await fetch(formulario.action, {
                method: "POST",
                body: new FormData(formulario),             // Empaqueta todos los campos del form
                headers: { "Accept": "application/json" }   // Pedimos JSON (evita redirección)
            });

            if (!respuesta.ok) throw new Error("Formspree rechazó el envío");

            // Éxito: confirmamos y ofrecemos la vía rápida por WhatsApp
            nota.innerHTML = `✅ Mensaje enviado al correo de Advisual. ¿Quieres respuesta más rápida? <a href="${linkWhatsApp}" target="_blank" rel="noopener">Avísanos también por WhatsApp →</a>`;
            formulario.reset(); // Limpiamos los campos
        } catch (error) {
            // Si falla el correo (sin internet, servicio caído), WhatsApp salva el contacto
            window.open(linkWhatsApp, "_blank");
            nota.textContent = "No pudimos enviar el correo, pero te abrimos WhatsApp con tu mensaje listo.";
        }
    });

    /* ──────────────────────────────────────────────
       8. VISOR DE VIDEO (modal del portafolio)
       Abre el video de cualquier tarjeta que tenga
       el atributo data-video. Se cierra con el botón ✕,
       haciendo clic en el fondo oscuro o con la tecla Esc.
       ────────────────────────────────────────────── */
    const visor       = document.getElementById("visor");
    const visorVideo  = document.getElementById("visorVideo");
    const visorTitulo = document.getElementById("visorTitulo");
    const visorCerrar = document.getElementById("visorCerrar");

    // Función ABRIR: recibe la tarjeta clickeada y muestra su video
    const abrirVisor = (tarjeta) => {
        visorVideo.src = tarjeta.dataset.video;           // Cargamos el video recién ahora (ahorro de datos)
        visorTitulo.textContent = tarjeta.dataset.titulo; // Título debajo del video
        visor.classList.add("abierto");                   // El CSS lo hace visible con transición
        visor.setAttribute("aria-hidden", "false");       // Avisamos a lectores de pantalla
        document.body.style.overflow = "hidden";          // Bloqueamos el scroll de la página de fondo
        visorVideo.play().catch(() => {});                // Reproduce; si el navegador lo bloquea, no pasa nada
    };

    // Función CERRAR: detiene el video y restaura la página
    const cerrarVisor = () => {
        visorVideo.pause();
        visorVideo.removeAttribute("src"); // Liberamos la memoria del video
        visorVideo.load();                 // Reseteamos el reproductor
        visor.classList.remove("abierto");
        visor.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Devolvemos el scroll a la página
    };

    // Clic en cualquier tarjeta del portafolio que tenga data-video → abrir
    document.querySelectorAll(".proyecto[data-video]").forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => abrirVisor(tarjeta));
        // Accesibilidad: Enter o Espacio también abren (la tarjeta tiene tabindex="0")
        tarjeta.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault(); // Evita que Espacio haga scroll de la página
                abrirVisor(tarjeta);
            }
        });
    });

    // Tres formas de cerrar: botón ✕, clic en el fondo oscuro, tecla Escape
    visorCerrar.addEventListener("click", cerrarVisor);
    visor.querySelector("[data-cerrar]").addEventListener("click", cerrarVisor);
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && visor.classList.contains("abierto")) cerrarVisor();
    });

});
