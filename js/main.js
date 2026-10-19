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
       0. INTRO CINEMATOGRÁFICA (bumper del logo, 5 s)
       Pantalla negra con el logo animado que se desvanece
       y revela la página — como los estudios de cine.
       Reglas de buen comportamiento:
       - Solo se muestra UNA vez por visita (sessionStorage)
       - Clic o cualquier tecla = saltar al instante
       - Si el video falla o el usuario prefiere menos
         movimiento (ajuste de su sistema), se omite
       - Seguro anti-bloqueo: máximo 7 s pase lo que pase
       ────────────────────────────────────────────── */
    const intro = document.getElementById("intro");
    const introVideo = document.getElementById("introVideo");

    // Función que revela la página: desvanece la intro y RECIÉN AHORA
    // arrancan las animaciones de scroll (para que nadie se las pierda detrás del telón)
    let introTerminada = false;
    const cerrarIntro = () => {
        if (introTerminada) return;              // Evita que se ejecute dos veces
        introTerminada = true;
        intro.classList.add("oculto");           // El CSS lo desvanece suavemente (0,8 s)
        introVideo.pause();
        document.body.style.overflow = "";       // Devolvemos el scroll a la página
        AOS.init({ duration: 800, once: true, offset: 80 }); // Animaciones arrancan ahora
    };

    // ¿Debemos mostrar la intro?
    const introYaVista = sessionStorage.getItem("introVista"); // Ya se mostró en esta visita
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches; // Accesibilidad

    if (introYaVista || sinMovimiento) {
        intro.remove();                          // La quitamos del documento por completo
        AOS.init({ duration: 800, once: true, offset: 80 }); // Y arrancamos las animaciones de una
    } else {
        document.body.style.overflow = "hidden"; // Sin scroll mientras la intro está encima
        sessionStorage.setItem("introVista", "1"); // Marcamos: ya se mostró en esta sesión
        introVideo.play().catch(() => {});       // Autoplay (muted = el navegador lo permite)
        introVideo.addEventListener("ended", cerrarIntro);   // Video termina → revelar página
        intro.addEventListener("click", cerrarIntro);        // Clic = saltar
        document.addEventListener("keydown", cerrarIntro, { once: true }); // Tecla = saltar
        introVideo.addEventListener("error", cerrarIntro);   // Video falla → mostrar la página igual
        setTimeout(cerrarIntro, 7000);           // Seguro: máximo 7 s aunque algo falle
    }

    /* ──────────────────────────────────────────────
       1. ANIMACIONES AL HACER SCROLL (librería AOS)
       OJO: AOS se inicializa en la sección 0 (después de la
       intro), no aquí — si arrancara antes, las animaciones
       del hero correrían detrás de la pantalla negra y el
       visitante se las perdería.
       ────────────────────────────────────────────── */

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
