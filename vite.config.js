// ══════════════════════════════════════════════════════════════
// Configuración de Vite para ADVISUAL
// El plugin de Cloudflare le enseña a Vite cómo empaquetar el
// sitio para la plataforma de despliegue de Cloudflare (Workers).
// ══════════════════════════════════════════════════════════════
import { defineConfig } from "vite";               // Ayudante oficial para tipar la config
import { cloudflare } from "@cloudflare/vite-plugin"; // El puente Vite ↔ Cloudflare

export default defineConfig({
    plugins: [cloudflare()], // Registramos el plugin: sin esto, el despliegue en Cloudflare falla
});
