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
       Lee los atributos data-aos="..." que pusimos en el HTML
       y anima cada elemento cuando entra en pantalla.
       ────────────────────────────────────────────── */
    AOS.init({
        duration: 800,   // Cada animación dura 0,8 segundos
        once: true,      // Se anima solo la PRIMERA vez (no se repite al subir y bajar)
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

    /* ──────────────────────────────────────────────
       5. CONTADORES ANIMADOS (la sección de cifras)
       Cuentan de 0 hasta el número final cuando la
       sección se hace visible. Usamos IntersectionObserver,
       que es la forma moderna y eficiente de detectar
       cuándo algo entra en pantalla.
       ────────────────────────────────────────────── */
    const numeros = document.querySelectorAll(".cifra__numero"); // Todos los números a animar

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return; // Si aún no es visible, no hacemos nada

            const elemento = entrada.target;
            const meta = Number(elemento.dataset.meta); // Número final (viene del HTML: data-meta="120")
            const duracion = 1600;                       // La cuenta dura 1,6 segundos
            const inicio = performance.now();            // Momento exacto en que empieza

            // Esta función se ejecuta en cada "cuadro" de la animación (~60 veces/segundo)
            const avanzar = (ahora) => {
                const progreso = Math.min((ahora - inicio) / duracion, 1); // 0 → 1
                elemento.textContent = Math.floor(progreso * meta);        // Número redondeado hacia abajo
                if (progreso < 1) requestAnimationFrame(avanzar);          // Seguimos hasta llegar a la meta
            };
            requestAnimationFrame(avanzar);

            observador.unobserve(elemento); // Ya se animó: dejamos de observarlo (ahorra recursos)
        });
    }, { threshold: 0.5 }); // Se activa cuando el 50% del número ya es visible

    numeros.forEach((n) => observador.observe(n)); // Ponemos a todos los números "bajo vigilancia"

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
       7. CARRUSEL DE TESTIMONIOS
       Desliza la "pista" horizontalmente. Si hay 3 tarjetas,
       las posiciones son 0%, -100% y -200%.
       ────────────────────────────────────────────── */
    const pista = document.getElementById("pistaCarrusel");
    const totalTestimonios = pista.children.length; // Cuántas tarjetas hay (3)
    let indice = 0;                                 // Cuál se está mostrando (0 = la primera)

    const mostrarTestimonio = (nuevoIndice) => {
        // El módulo (%) hace que después de la última vuelva a la primera (y al revés)
        indice = (nuevoIndice + totalTestimonios) % totalTestimonios;
        pista.style.transform = `translateX(-${indice * 100}%)`; // Desliza la pista
    };

    document.getElementById("btnSiguiente").addEventListener("click", () => mostrarTestimonio(indice + 1));
    document.getElementById("btnAnterior").addEventListener("click", () => mostrarTestimonio(indice - 1));

    // Avance automático cada 6 segundos
    setInterval(() => mostrarTestimonio(indice + 1), 6000);

    /* ──────────────────────────────────────────────
       8. FORMULARIO DE CONTACTO
       Dos modos:
       a) Si ya configuraste Formspree (cambiaste TU_ID), el
          formulario se envía normal y te llega al correo.
       b) Mientras tanto, lo convertimos en un mensaje de
          WhatsApp con todos los datos ya escritos.
       ────────────────────────────────────────────── */
    const formulario = document.getElementById("formContacto");
    const nota = document.getElementById("notaFormulario");

    formulario.addEventListener("submit", (evento) => {
        // ¿El action todavía tiene el texto de relleno "TU_ID"?
        const formularioSinConfigurar = formulario.action.includes("TU_ID");

        if (formularioSinConfigurar) {
            evento.preventDefault(); // Frenamos el envío normal (aún no hay dónde recibirlo)

            // Leemos lo que escribió el visitante
            const nombre  = document.getElementById("nombre").value;
            const tipo    = document.getElementById("tipo").value;
            const mensaje = document.getElementById("mensaje").value;

            // Armamos el texto de WhatsApp. encodeURIComponent convierte espacios y
            // tildes en un formato seguro para URLs (%20, %C3%A9, etc.)
            const texto = encodeURIComponent(
                `Hola Advisual 👋 Soy ${nombre}. Me interesa: ${tipo}. ${mensaje}`
            );

            // Abrimos WhatsApp con el mensaje listo para enviar (número oficial de Advisual)
            window.open(`https://wa.me/56953334461?text=${texto}`, "_blank");

            nota.textContent = "✅ Te abrimos WhatsApp con tu mensaje listo para enviar.";
        } else {
            nota.textContent = "Enviando..."; // Modo Formspree: el envío sigue su curso normal
        }
    });

});
