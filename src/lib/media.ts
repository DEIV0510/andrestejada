// Datos de imagen listos para <picture>: anchos medidos del archivo real (media.json).
import media from '@/data/media.json';
import type { MediaId } from '@/data/catalogo';

type Set = [string, number][];
export type Recorte = 'full' | 'card' | 'detalle';
interface Crop {
  w: number;
  h: number;
  bg: string;
  avif: Set;
  webp: Set;
}
interface Entry {
  alt: string;
  crops: Partial<Record<Recorte, Crop>> & Record<'full' | 'card', Crop>;
}

export const getMedia = (id: MediaId) => (media as unknown as Record<string, Entry>)[id];

const srcset = (set: Set) => set.map(([url, w]) => `${url} ${w}w`).join(', ');

export function pictureData(id: MediaId, recorte: Recorte) {
  const m = getMedia(id);
  const c = m.crops[recorte];
  if (!c) throw new Error(`La foto «${id}» no tiene el recorte «${recorte}» (scripts/imagenes.config.mjs)`);
  // Respaldo para navegadores sin srcset: la WebP de ~720 px (o la mayor si no llega).
  const src = c.webp.find(([, w]) => w >= 700)?.[0] ?? c.webp[c.webp.length - 1][0];
  return { avif: srcset(c.avif), webp: srcset(c.webp), src, width: c.w, height: c.h, alt: m.alt, bg: c.bg };
}

/** URL absoluta de la imagen más grande en WebP (Open Graph de las fichas). */
export const imagenOG = (id: MediaId, recorte: 'full' | 'card' = 'card') => {
  const c = getMedia(id).crops[recorte];
  return c.webp.find(([, w]) => w >= 1000)?.[0] ?? c.webp[c.webp.length - 1][0];
};
