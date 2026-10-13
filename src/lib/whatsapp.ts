// Enlaces de WhatsApp con mensaje prellenado. Se construyen en el build (sin JS);
// el selector de acabado los reescribe en el navegador con la misma función.
import { MARCA, WHATSAPP_E164 } from './contacto';

export const waUrl = (mensaje: string) => `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(mensaje)}`;

/** Mensaje general (header, botón flotante, hero). */
export const MENSAJE_GENERAL = `Hola, ${MARCA.nombre}. Quiero información sobre sus uniformes y accesorios de aviación.`;

interface MensajeProducto {
  nombre: string;
  /** Variante elegida (p. ej. «acabado dorado»). */
  variante?: string | null;
  /** El producto no tiene foto publicada: se piden fotos también. */
  sinFoto?: boolean;
  /** URL absoluta de la ficha, si existe. */
  url?: string | null;
}

/** Mensaje del brief: producto + precio, tallas o variantes y envío. */
export function mensajeProducto({ nombre, variante, sinFoto, url }: MensajeProducto) {
  const producto = variante ? `${nombre} (${variante})` : nombre;
  const pedido = sinFoto
    ? '¿Me pueden compartir fotos, el precio, las tallas o variantes disponibles y las opciones de envío?'
    : '¿Me pueden compartir el precio, las tallas o variantes disponibles y las opciones de envío?';
  const ref = url ? `\n${url}` : '';
  return `Hola, ${MARCA.nombre}. Estoy interesado en el producto ${producto}. ${pedido}${ref}`;
}

export const waProducto = (p: MensajeProducto) => waUrl(mensajeProducto(p));
