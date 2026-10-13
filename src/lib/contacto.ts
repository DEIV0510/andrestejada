// Datos de contacto: ÚNICA fuente. El número es provisional (brief del cliente):
// al cambiarlo aquí se actualizan todos los enlaces y mensajes del sitio.

/** Número de WhatsApp en formato nacional (Colombia), tal como lo dio el cliente. */
export const WHATSAPP_NACIONAL = '3045896779';
/** Indicativo internacional de Colombia. */
export const INDICATIVO = '57';
/** Número internacional sin signos, para wa.me. */
export const WHATSAPP_E164 = `${INDICATIVO}${WHATSAPP_NACIONAL}`;
/** Número para mostrar, con espacios duros para que no se parta en dos líneas. */
export const WHATSAPP_VISIBLE = `+${INDICATIVO} ${WHATSAPP_NACIONAL.slice(0, 3)} ${WHATSAPP_NACIONAL.slice(3, 6)} ${WHATSAPP_NACIONAL.slice(6)}`;

export const INSTAGRAM = {
  usuario: 'aviationshop_at',
  url: 'https://www.instagram.com/aviationshop_at/',
  /** Bio real del perfil (consultada el 2026-10-13), sin emojis. */
  bio: 'Accesorios & Uniformes Aeronáuticos · Envíos a toda Colombia',
};

export const MARCA = {
  nombre: 'Andrés Tejada Aviation Shop',
  corto: 'Andrés Tejada',
  /** Lo confirmado en el brief. Nada más. */
  tienda: 'Tienda virtual',
  envios: 'Envíos a toda Colombia',
  /** Ventas al por mayor: el cliente dice que aún no están disponibles. No se muestran. */
  mayoristas: false,
};
