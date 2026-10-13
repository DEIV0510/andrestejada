// Fuentes autoalojadas: Manrope variable (titulares) e Inter variable (texto e interfaz).
// - Recorta cada fuente a los glifos del español que usa el sitio (todas las funciones
//   OpenType se conservan: tnum, cifras con barra, etc.).
// - Limita los ejes de peso a lo que se usa: Manrope 600–800, Inter 400–600.
// - Nombre con hash (caché inmutable) en public/fonts/.
// - Genera src/styles/fuentes.css con @font-face + fuentes de respaldo con métricas
//   ajustadas (capsize): al llegar la fuente real el diseño no se mueve.
// - Genera src/data/fuentes.json con las rutas para el <link rel="preload">.
// Uso: npm run fonts
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import subsetFont from 'subset-font';
import { createFontStack } from '@capsizecss/core';
import manrope from '@capsizecss/metrics/manrope';
import inter from '@capsizecss/metrics/inter';
import arial from '@capsizecss/metrics/arial';

const OUT_DIR = 'public/fonts';
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let chars = '';
for (let c = 0x20; c <= 0x7e; c++) chars += String.fromCharCode(c); // ASCII imprimible
for (let c = 0xa0; c <= 0xff; c++) chars += String.fromCharCode(c); // á é í ó ú ñ ü ¿ ¡ « » · ×
chars += [0x2013, 0x2014, 0x2018, 0x2019, 0x201c, 0x201d, 0x2026, 0x2022, 0x2116, 0x2212, 0x2009, 0x202f]
  .map((c) => String.fromCharCode(c))
  .join('');

const hash = (buf) => crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);

async function build(src, base, opts = {}) {
  const input = fs.readFileSync(src);
  const out = await subsetFont(input, chars, { targetFormat: 'woff2', ...opts });
  const name = `${base}.${hash(out)}.woff2`;
  fs.writeFileSync(path.join(OUT_DIR, name), out);
  console.log(`${name}: ${(input.length / 1024).toFixed(1)} KB → ${(out.length / 1024).toFixed(1)} KB`);
  return `/fonts/${name}`;
}

const manropeHref = await build('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2', 'manrope', {
  variationAxes: { wght: { min: 600, max: 800 } },
});
const interHref = await build('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter', {
  variationAxes: { wght: { min: 400, max: 600 } },
});

// Respaldo con métricas de la fuente real: Arial escalada para ocupar lo mismo.
const display = createFontStack([manrope, arial], { fontFaceFormat: 'styleString' });
const text = createFontStack([inter, arial], { fontFaceFormat: 'styleString' });

// Rótulos y botones (MAYÚSCULAS con espaciado): ahí Arial sale ~5 % más ancha que Inter
// aunque el respaldo esté ajustado para minúsculas. Medido en el navegador
// (.cache/qa/yo-fuentes.mjs): ancho Inter / ancho respaldo = 0,946 de media.
const ESCALA_ROTULO = 0.946;
const ajuste = (pct) => parseFloat(text.fontFaces.match(new RegExp(pct + ': ([0-9.]+)%'))[1]);
const sizeAdjust = ajuste('size-adjust');
const rotuloSize = sizeAdjust * ESCALA_ROTULO;
const escalar = (pct) => ((ajuste(pct) * sizeAdjust) / rotuloSize).toFixed(4);
const rotuloFace = `@font-face {
  font-family: "Inter Rotulo Fallback";
  src: local('Arial'), local('ArialMT');
  ascent-override: ${escalar('ascent-override')}%;
  descent-override: ${escalar('descent-override')}%;
  line-gap-override: 0%;
  size-adjust: ${rotuloSize.toFixed(4)}%;
}`;

const css = `/* Generado por scripts/fuentes.mjs — no editar a mano. */
@font-face {
  font-family: 'Manrope';
  src: url('${manropeHref}') format('woff2');
  font-weight: 600 800;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('${interHref}') format('woff2');
  font-weight: 400 600;
  font-style: normal;
  font-display: swap;
}
${display.fontFaces}
${text.fontFaces}
${rotuloFace}
:root {
  --font-display: ${display.fontFamily}, system-ui, sans-serif;
  --font-text: ${text.fontFamily}, system-ui, sans-serif;
  --font-rotulo: Inter, "Inter Rotulo Fallback", Arial, system-ui, sans-serif;
}
`;

fs.mkdirSync('src/styles', { recursive: true });
fs.writeFileSync('src/styles/fuentes.css', css);
fs.writeFileSync('src/data/fuentes.json', JSON.stringify({ manrope: manropeHref, inter: interHref }, null, 2) + '\n');
console.log('→ src/styles/fuentes.css, src/data/fuentes.json');
