// Verificación del build (dist/): falla si algo está roto. Uso: npm run check
// - Enlaces internos y recursos (href, src, srcset) que no existen en dist/
// - Enlaces vacíos o «#» sin destino
// - WhatsApp: número correcto y producto escrito en el mensaje
// - Imágenes sin alt, sin width/height, o srcset que declara un ancho distinto al real
// - Un solo <h1> por página
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIST = 'dist';
const NUMERO = '573045896779';
const errores = [];
const err = (archivo, msg) => errores.push(`${archivo}: ${msg}`);

const paginas = [];
(function recorrer(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) recorrer(p);
    else if (f.endsWith('.html')) paginas.push(p);
  }
})(DIST);

const existe = (url) => {
  const limpio = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!limpio) return true;
  const p = path.join(DIST, limpio);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  return fs.existsSync(path.join(p, 'index.html'));
};

const anchosReales = new Map();
async function anchoReal(url) {
  if (!anchosReales.has(url)) anchosReales.set(url, (await sharp(path.join(DIST, url)).metadata()).width);
  return anchosReales.get(url);
}

let whatsapp = 0;
for (const archivo of paginas) {
  const html = fs.readFileSync(archivo, 'utf8');
  const rel = path.relative(DIST, archivo);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  if ((html.match(/<h1[\s>]/g) || []).length !== 1) err(rel, 'debe tener exactamente un <h1>');

  for (const [, href] of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
    if (!href || href === '#') err(rel, `enlace sin destino: "${href}"`);
    else if (href.startsWith('https://wa.me/')) {
      whatsapp++;
      const u = new URL(href.replace(/&amp;/g, '&'));
      if (u.pathname !== `/${NUMERO}`) err(rel, `WhatsApp con otro número: ${u.pathname}`);
      if (!u.searchParams.get('text')) err(rel, 'WhatsApp sin mensaje');
    } else if (href.startsWith('/')) {
      if (!existe(href)) err(rel, `enlace interno roto: ${href}`);
      const ancla = href.split('#')[1];
      if (ancla && href.split('#')[0] === '/' && rel === 'index.html' && !ids.has(ancla)) err(rel, `ancla inexistente: #${ancla}`);
    } else if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) err(rel, `ancla inexistente: ${href}`);
    }
  }

  for (const [, src] of html.matchAll(/\s(?:src|href)="(\/[^"]+\.(?:webp|avif|png|jpg|svg|woff2|webmanifest|ico))"/g)) {
    if (!existe(src)) err(rel, `recurso inexistente: ${src}`);
  }
  for (const [, set] of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const parte of set.split(',')) {
      const [url, w] = parte.trim().split(/\s+/);
      if (!existe(url)) {
        err(rel, `srcset con archivo inexistente: ${url}`);
        continue;
      }
      const real = await anchoReal(url);
      if (w && Number(w.replace('w', '')) !== real) err(rel, `srcset miente: ${url} dice ${w}, mide ${real}`);
    }
  }
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(img)) err(rel, `imagen sin alt: ${img.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) err(rel, `imagen sin width/height: ${img.slice(0, 80)}`);
  }
}

// Mensajes de producto: cada producto del catálogo aparece por nombre en algún enlace de WhatsApp.
const portada = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const mensajes = [...portada.matchAll(/href="https:\/\/wa\.me\/[^"?]+\?text=([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/&amp;/g, '&')));
// Node 24 ejecuta TypeScript sin compilar (quita los tipos): se lee el catálogo real.
const { PRODUCTOS } = await import('../src/data/catalogo.ts');
{
  for (const p of PRODUCTOS) {
    const nombre = p.mensaje ? 'aviones a escala' : p.nombre;
    if (!mensajes.some((m) => m.toLowerCase().includes(nombre.toLowerCase()))) err('index.html', `ningún mensaje de WhatsApp nombra «${p.nombre}»`);
  }
}

console.log(`${paginas.length} páginas · ${whatsapp} enlaces de WhatsApp · ${anchosReales.size} imágenes medidas`);
if (errores.length) {
  console.error(errores.map((e) => `✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log('✓ Sin errores');
