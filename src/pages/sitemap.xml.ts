// Sitemap: portada + fichas de producto (solo las que existen).
import type { APIRoute } from 'astro';
import { conFicha, urlFicha } from '@/data/catalogo';

export const GET: APIRoute = ({ site }) => {
  const urls = ['/', ...conFicha().map((p) => urlFicha(p)!)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u, site).href}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
