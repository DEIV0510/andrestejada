// CATÁLOGO — única fuente de productos. La presentación sale sola de estos datos.
//
// Regla del cliente: no inventar. Por eso:
//   precio: null  → se muestra «consultar por WhatsApp» (nunca un valor inventado)
//   tallas: null  → no se muestra selector de tallas
//   foto:   null  → el producto se muestra como fila tipográfica que pide fotos por WhatsApp
//
// Para completar un producto cuando el cliente mande la información:
//   - Foto nueva: añadirla en scripts/imagenes.config.mjs, correr `npm run images`
//     y poner su id en `foto`. La fila pasa a ser tarjeta con ficha propia.
//   - Precio: número en pesos colombianos, sin puntos (ej. 185000).
//   - Tallas: lista de textos (ej. ['S', 'M', 'L']).
import type media from './media.json';

export type MediaId = keyof typeof media;
export type CategoriaId = 'uniformes' | 'accesorios' | 'aviones-a-escala';

export interface Opcion {
  id: string;
  /** Texto del botón: «Dorado». */
  nombre: string;
  /** Cómo se nombra en el mensaje de WhatsApp: «acabado dorado». */
  enMensaje: string;
  foto: MediaId;
  /** Color de la muestra en la tarjeta. */
  muestra: string;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: CategoriaId;
  /** Subgrupo dentro de la categoría (solo «coleccionismo» por ahora). */
  grupo?: keyof typeof GRUPOS;
  /** Una línea, la que se ve en la fila o en la ficha. */
  linea: string;
  foto: MediaId | null;
  /** Variantes reales (con foto). */
  variantes?: { nombre: string; opciones: Opcion[] } | null;
  precio: number | null;
  tallas: string[] | null;
  /** Texto de la acción en filas sin foto. */
  accion?: string;
  /** Mensaje propio de WhatsApp (si no, se usa el del brief). */
  mensaje?: string;
}

/** Subgrupos dentro de una categoría y su rótulo visible. */
export const GRUPOS = { coleccionismo: 'Coleccionismo' } as const;

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  /** Título de la sección. */
  titulo: string;
  linea: string;
  /** Galones de la presilla de la sección. */
  galones: 1 | 2 | 3;
}

export const CATEGORIAS: Categoria[] = [
  {
    id: 'uniformes',
    nombre: 'Uniformes',
    titulo: 'Uniformes',
    linea: 'Camisa y pantalón, en línea clásica o táctica.',
    galones: 1,
  },
  {
    id: 'accesorios',
    nombre: 'Accesorios',
    titulo: 'Accesorios',
    linea: 'Alas, presillas, corbatas y zapatos de piloto.',
    galones: 2,
  },
  {
    id: 'aviones-a-escala',
    nombre: 'Aviones a escala',
    titulo: 'Aviones a escala y coleccionismo',
    linea: 'Modelos a escala, pines y llaveros de aviación.',
    galones: 3,
  },
];

export const PRODUCTOS: Producto[] = [
  // ── Uniformes (confirmados en el brief; sin fotos todavía) ──
  {
    id: 'uniforme-clasico-de-piloto',
    nombre: 'Uniforme clásico de piloto',
    categoria: 'uniformes',
    linea: 'Camisa y pantalón. Fotos y tallas por WhatsApp.',
    foto: null,
    precio: null,
    tallas: null,
  },
  {
    id: 'uniforme-tactico-de-aviacion',
    nombre: 'Uniforme táctico de aviación',
    categoria: 'uniformes',
    linea: 'Camisa y pantalón. Fotos y tallas por WhatsApp.',
    foto: null,
    precio: null,
    tallas: null,
  },

  // ── Accesorios ──
  {
    id: 'alas-de-piloto-piper',
    nombre: 'Alas de piloto Piper',
    categoria: 'accesorios',
    linea: 'Alas doradas con escudo esmaltado Piper.',
    foto: 'alas-piper',
    precio: null,
    tallas: null,
  },
  {
    id: 'alas-de-piloto-cessna',
    nombre: 'Alas de piloto Cessna',
    categoria: 'accesorios',
    linea: 'Alas doradas con escudo esmaltado Cessna.',
    foto: 'alas-cessna',
    precio: null,
    tallas: null,
  },
  {
    id: 'presillas-de-piloto',
    nombre: 'Presillas de piloto',
    categoria: 'accesorios',
    linea: 'Modelos y tallas por WhatsApp.',
    foto: null,
    precio: null,
    tallas: null,
  },
  {
    id: 'corbatas',
    nombre: 'Corbatas',
    categoria: 'accesorios',
    linea: 'Modelos disponibles por WhatsApp.',
    foto: null,
    precio: null,
    tallas: null,
  },
  {
    id: 'zapatos-de-piloto',
    nombre: 'Zapatos de piloto',
    categoria: 'accesorios',
    linea: 'Modelos y tallas por WhatsApp.',
    foto: null,
    precio: null,
    tallas: null,
  },

  // ── Aviones a escala y coleccionismo ──
  {
    id: 'aviones-a-escala',
    nombre: 'Aviones a escala',
    categoria: 'aviones-a-escala',
    linea: 'Consulta los modelos disponibles.',
    foto: null,
    precio: null,
    tallas: null,
    accion: 'Preguntar modelos',
    mensaje: 'Hola, Andrés Tejada Aviation Shop. Quiero saber qué modelos de aviones a escala tienen disponibles, con sus precios y opciones de envío.',
  },
  {
    id: 'pin-avion-metalico',
    nombre: 'Pin avión metálico',
    categoria: 'aviones-a-escala',
    grupo: 'coleccionismo',
    linea: 'Avión cuatrimotor en metal. Dorado o plateado.',
    foto: 'pin-avion-dorado',
    variantes: {
      nombre: 'Acabado',
      opciones: [
        { id: 'dorado', nombre: 'Dorado', enMensaje: 'acabado dorado', foto: 'pin-avion-dorado', muestra: '#C6A13B' },
        { id: 'plateado', nombre: 'Plateado', enMensaje: 'acabado plateado', foto: 'pin-avion-plateado', muestra: '#BFC3C7' },
      ],
    },
    precio: null,
    tallas: null,
  },
  {
    id: 'pin-avion-esmaltado',
    nombre: 'Pin avión esmaltado',
    categoria: 'aviones-a-escala',
    grupo: 'coleccionismo',
    linea: 'Avión esmaltado en blanco, azul y verde.',
    foto: 'pines-esmaltados',
    precio: null,
    tallas: null,
  },
  {
    id: 'llavero-remove-before-flight',
    nombre: 'Llavero Remove Before Flight',
    categoria: 'aviones-a-escala',
    grupo: 'coleccionismo',
    linea: 'Cinta roja bordada con argolla metálica.',
    foto: 'llavero-rbf',
    precio: null,
    tallas: null,
  },
];

export const porCategoria = (id: CategoriaId) => PRODUCTOS.filter((p) => p.categoria === id);
export const categoria = (id: CategoriaId) => CATEGORIAS.find((c) => c.id === id)!;
/** Productos con ficha propia: solo los que tienen foto real. */
export const conFicha = () => PRODUCTOS.filter((p) => p.foto);
export const urlFicha = (p: Producto) => (p.foto ? `/catalogo/${p.id}/` : null);
export const categoriaDe = (p: Producto) => CATEGORIAS.find((c) => c.id === p.categoria)!;

const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const precioTexto = (p: Producto) => (p.precio == null ? null : COP.format(p.precio));
