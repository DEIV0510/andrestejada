// Marca: vectoriza el logo original (PNG con alfa) con potrace, sin redibujarlo.
// - Separa el dorado y el negro por color y traza cada pieza por separado.
// - El negro pasa a `currentColor`: el mismo logo sirve sobre blanco y sobre negro.
// - Comprueba la fidelidad (IoU de cada pieza contra el PNG) y falla si baja de 97 %.
// - Escribe src/data/marca.json (trazados + viewBox de cada versión), los favicons,
//   el icono para iOS/Android y la imagen Open Graph.
// Uso: npm run brand   (requiere haber corrido `npm run images` para la OG)
import fs from 'node:fs';
import sharp from 'sharp';
import potrace from 'potrace';

const SRC = '_material-cliente/logo-original.png';
const ESCALA = 3; // se traza a 3x para que las curvas salgan suaves y precisas

// Oro del logo, medido en el PNG (mediana de los píxeles dorados opacos).
export const ORO_LOGO = '#d49c00';

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;

// Cobertura suave (0–1) de cada tinta: así el contorno se traza con precisión subpíxel.
const cobertura = {
  oro: (r, g, b, a) => (a / 255) * Math.min(1, Math.max(0, (r - b - 40) / 150)),
  tinta: (r, g, b, a) => (a / 255) * Math.min(1, Math.max(0, (150 - Math.max(r, g, b)) / 110)),
};

// Piezas del logo (coordenadas del PNG original, medidas por filas: nombre 196–331,
// AVIATION SHOP 362–435, regla 455–465, lema 500–531; el ala derecha llega a x≈663).
const PIEZAS = {
  emblema: { tinta: 'oro', x0: 0, x1: 670, y0: 150, y1: 480 },
  nombre: { tinta: 'tinta', x0: 670, x1: W, y0: 150, y1: 346 },
  aviation: { tinta: 'oro', x0: 670, x1: W, y0: 346, y1: 446 },
  regla: { tinta: 'tinta', x0: 670, x1: W, y0: 446, y1: 482 },
  lema: { tinta: 'tinta', x0: 670, x1: W, y0: 482, y1: 560 },
};

function mascara(pieza) {
  const { tinta, x0, x1, y0, y1 } = pieza;
  const f = cobertura[tinta];
  const out = Buffer.alloc(W * H, 255);
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * W + x) * 4;
      out[y * W + x] = 255 - Math.round(255 * f(data[i], data[i + 1], data[i + 2], data[i + 3]));
    }
  return out; // negro = forma
}

const trazar = (buf) =>
  new Promise((ok, mal) => {
    const p = new potrace.Potrace({ threshold: 128, turdSize: 6, optTolerance: 0.4, alphaMax: 1 });
    p.loadImage(buf, (err) => (err ? mal(err) : ok(p.getPathTag())));
  });

// Pasa el trazado de potrace (absoluto, 3x) a coordenadas relativas en escala original,
// con 1 decimal y separadores mínimos: mismo dibujo, ~45 % menos de texto.
function compactar(d) {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  const r1 = (n) => Math.round(n * 10) / 10;
  const num = (n) => {
    const s = String(r1(n) === 0 ? 0 : r1(n));
    return s.replace(/^0\./, '.').replace(/^-0\./, '-.');
  };
  // Une números con el separador mínimo (el signo menos o el punto inicial separan solos).
  const unir = (nums) =>
    nums.reduce((acc, s, i) => (i === 0 || s.startsWith('-') || (s.startsWith('.') && /\.\d*$/.test(acc)) ? acc + s : `${acc} ${s}`), '');
  let out = '';
  let cx = 0, cy = 0, sx = 0, sy = 0;
  let i = 0;
  let cmd = '';
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MLCZ]/i.test(t)) {
      cmd = t.toUpperCase();
      i++;
      if (cmd === 'Z') {
        out += 'z';
        cx = sx;
        cy = sy;
        continue;
      }
    }
    const take = (n) => tokens.slice(i, (i += n)).map((v) => Number(v) / ESCALA);
    if (cmd === 'M') {
      const [x, y] = take(2);
      out += `m${unir([num(x - cx), num(y - cy)])}`;
      // redondeo acumulado: avanzar con el valor redondeado para no derivar
      cx = cx + r1(x - cx);
      cy = cy + r1(y - cy);
      sx = cx;
      sy = cy;
      cmd = 'L';
    } else if (cmd === 'L') {
      const [x, y] = take(2);
      const dx = r1(x - cx), dy = r1(y - cy);
      out += `l${unir([num(dx), num(dy)])}`;
      cx += dx;
      cy += dy;
    } else if (cmd === 'C') {
      const [x1, y1, x2, y2, x, y] = take(6);
      const dx = r1(x - cx), dy = r1(y - cy);
      out += `c${unir([num(x1 - cx), num(y1 - cy), num(x2 - cx), num(y2 - cy), num(dx), num(dy)])}`;
      cx += dx;
      cy += dy;
    } else {
      throw new Error(`Comando inesperado en el trazado: ${t}`);
    }
  }
  return out;
}

const trazados = {};
for (const [nombre, pieza] of Object.entries(PIEZAS)) {
  const m = mascara(pieza);
  const grande = await sharp(m, { raw: { width: W, height: H, channels: 1 } })
    .resize(W * ESCALA, H * ESCALA, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
  const tag = await trazar(grande);
  const d = compactar(tag.match(/ d="([^"]+)"/)[1]);
  trazados[nombre] = d;
}

// Caja de cada versión (con un pequeño margen) — medidas en el PNG.
const caja = (x0, y0, x1, y1) => ({ x: x0, y: y0, w: x1 - x0, h: y1 - y0, vb: `${x0} ${y0} ${x1 - x0} ${y1 - y0}` });
const bbox = {};
for (const [nombre, pieza] of Object.entries(PIEZAS)) {
  const m = mascara(pieza);
  let a = W, b = H, c = 0, e = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (m[y * W + x] < 128) {
        if (x < a) a = x;
        if (x > c) c = x;
        if (y < b) b = y;
        if (y > e) e = y;
      }
  bbox[nombre] = { x0: a, y0: b, x1: c + 1, y1: e + 1 };
}
const pad = 2;
const union = (...ns) => {
  const bs = ns.map((n) => bbox[n]);
  return caja(
    Math.min(...bs.map((q) => q.x0)) - pad,
    Math.min(...bs.map((q) => q.y0)) - pad,
    Math.max(...bs.map((q) => q.x1)) + pad,
    Math.max(...bs.map((q) => q.y1)) + pad,
  );
};

const versiones = {
  completo: { piezas: ['emblema', 'nombre', 'aviation', 'regla', 'lema'], ...union('emblema', 'nombre', 'aviation', 'regla', 'lema') },
  compacto: { piezas: ['emblema', 'nombre', 'aviation'], ...union('emblema', 'nombre', 'aviation') },
  emblema: { piezas: ['emblema'], ...union('emblema') },
  texto: { piezas: ['nombre', 'aviation'], ...union('nombre', 'aviation') },
};

// --- Fidelidad: IoU de cada pieza (raster del trazado vs máscara del PNG) ---
async function rasterSVG(d) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000" fill-rule="evenodd"/></svg>`;
  return (await sharp(Buffer.from(svg)).greyscale().raw().toBuffer());
}
// El lema es texto de ~30 px con trazo fino: 0,2 px de borde ya pesa en el IoU.
const MINIMO = { lema: 0.93 };
let fallos = 0;
for (const [nombre, pieza] of Object.entries(PIEZAS)) {
  const m = mascara(pieza);
  const r = await rasterSVG(trazados[nombre]);
  let inter = 0, uni = 0;
  for (let i = 0; i < W * H; i++) {
    const p = m[i] < 128, q = r[i] < 128;
    if (p && q) inter++;
    if (p || q) uni++;
  }
  const iou = inter / uni;
  if (iou < (MINIMO[nombre] ?? 0.97)) fallos++;
  console.log(`${nombre}: IoU ${(iou * 100).toFixed(2)} % · ${(trazados[nombre].length / 1024).toFixed(1)} KB`);
}
if (fallos) {
  console.error('Fidelidad insuficiente: revisar umbrales de color.');
  process.exit(1);
}

fs.writeFileSync('src/data/marca.json', JSON.stringify({ oro: ORO_LOGO, trazados, versiones }, null, 2) + '\n');
console.log('→ src/data/marca.json');

// --- Favicons e iconos (emblema) ---
const svgDe = (version, { tinta = '#ffffff', fondo = null, margen = 0, ancho, alto } = {}) => {
  const v = versiones[version];
  const mw = v.w * margen, mh = v.h * margen;
  const vb = `${v.x - mw} ${v.y - mh} ${v.w + 2 * mw} ${v.h + 2 * mh}`;
  const paths = v.piezas
    .map((p) => `<path fill-rule="evenodd" d="${trazados[p]}" fill="${PIEZAS[p].tinta === 'oro' ? ORO_LOGO : tinta}"/>`)
    .join('');
  const bg = fondo ? `<rect x="${v.x - mw}" y="${v.y - mh}" width="${v.w + 2 * mw}" height="${v.h + 2 * mh}" fill="${fondo}"/>` : '';
  const size = ancho ? ` width="${ancho}" height="${alto}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${size} preserveAspectRatio="xMidYMid meet">${bg}${paths}</svg>`;
};

// Icono cuadrado: emblema centrado sobre negro, con aire.
async function iconoCuadrado(lado, margen = 0.14) {
  const v = versiones.emblema;
  const interior = Math.round(lado * (1 - 2 * margen));
  const emb = await sharp(Buffer.from(svgDe('emblema', { ancho: interior, alto: Math.round((interior * v.h) / v.w) })))
    .resize(interior, null)
    .png()
    .toBuffer();
  const meta = await sharp(emb).metadata();
  return sharp({ create: { width: lado, height: lado, channels: 4, background: '#090909' } })
    .composite([{ input: emb, left: Math.round((lado - meta.width) / 2), top: Math.round((lado - meta.height) / 2) }])
    .png()
    .toBuffer();
}

fs.mkdirSync('public', { recursive: true });
// favicon.svg: emblema sobre cuadrado negro (legible en pestañas claras y oscuras).
{
  const v = versiones.emblema;
  const lado = v.w * 1.16;
  const x = v.x - (lado - v.w) / 2, y = v.y - (lado - v.h) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${lado.toFixed(1)} ${lado.toFixed(1)}"><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${lado.toFixed(1)}" height="${lado.toFixed(1)}" fill="#090909"/><path fill-rule="evenodd" d="${trazados.emblema}" fill="${ORO_LOGO}"/></svg>`;
  fs.writeFileSync('public/favicon.svg', svg);
}
fs.writeFileSync('public/favicon-32.png', await iconoCuadrado(32, 0.06));
fs.writeFileSync('public/apple-touch-icon.png', await iconoCuadrado(180));
fs.writeFileSync('public/icon-192.png', await iconoCuadrado(192));
fs.writeFileSync('public/icon-512.png', await iconoCuadrado(512));
console.log('→ public/favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png');

// --- Imagen Open Graph 1200×630: logo en blanco sobre negro + foto real del pin ---
const media = JSON.parse(fs.readFileSync('src/data/media.json', 'utf8'));
const pin = media['pin-avion-dorado']?.crops?.card;
if (pin) {
  const fotoSrc = 'public' + pin.webp[pin.webp.length - 1][0];
  const fotoH = 630;
  const foto = await sharp(fotoSrc).resize({ height: fotoH }).toBuffer();
  const fotoW = (await sharp(foto).metadata()).width;
  const logoW = 1200 - fotoW - 120;
  const v = versiones.completo;
  const logo = await sharp(Buffer.from(svgDe('completo', { ancho: logoW, alto: Math.round((logoW * v.h) / v.w) })))
    .resize(logoW, null)
    .png()
    .toBuffer();
  const logoH = (await sharp(logo).metadata()).height;
  const linea = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect x="0" y="626" width="${1200 - fotoW}" height="4" fill="#C6A13B"/></svg>`,
  );
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#090909' } })
    .composite([
      { input: foto, left: 1200 - fotoW, top: 0 },
      { input: logo, left: 60, top: Math.round((630 - logoH) / 2) },
      { input: linea, left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile('public/og.jpg');
  console.log('→ public/og.jpg');
} else {
  console.warn('Sin src/data/media.json: corre `npm run images` antes para generar la OG.');
}
