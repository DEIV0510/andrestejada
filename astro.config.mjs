import { defineConfig } from 'astro/config';

// Dominio público: canonical, Open Graph y datos estructurados salen con URL absoluta.
// PENDIENTE: cambiarlo por el dominio real (o definir SITE_URL al compilar).
const site = process.env.SITE_URL || 'https://andrestejada-aviationshop.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS en línea: una petición bloqueante menos.
    inlineStylesheets: 'always',
  },
  // Los componentes que reciben `class` (Logo, Icono, Foto) heredan el alcance del padre.
  scopedStyleStrategy: 'class',
  compressHTML: true,
  devToolbar: { enabled: false },
  server: { port: 5500, host: true },
});
