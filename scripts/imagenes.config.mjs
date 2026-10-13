// Fotos reales del cliente (sacadas del PDF con `pdfimages -all`) y sus recortes.
// Ningún recorte altera el producto: solo se quita el marco de la captura del celular
// (alas Piper/Cessna) o se acerca el encuadre (pines). Cada recorte se exporta en
// AVIF + WebP a varios anchos, sin ampliar nunca el original.
//
// Recortes:
//   full → la foto entera (o la franja útil de la captura)
//   card → encuadre de tarjeta (4:5 en las verticales, 2:1 en las alas)
//
// El script mide el color real del fondo (mediana del borde de cada recorte): el marco
// de la tarjeta usa ese color mientras carga y para que la foto encaje sin fundidos.

const SRC = '_material-cliente/fotos-pdf';

// Recorte común a los dos acabados del pin metálico: al cambiar de acabado el pin
// queda en el mismo sitio (medido: dorado 656–1272 × 1116–1792).
const PIN_CARD = { left: 360, top: 710, width: 1200, height: 1500 };

export default [
  {
    id: 'alas-piper',
    src: `${SRC}/p3-alas-piper.png`,
    alt: 'Alas de piloto doradas con escudo esmaltado blanco y logotipo Piper',
    crops: {
      // franja blanca de la captura: y 878–1620
      full: { left: 0, top: 880, width: 1155, height: 738 },
      // objeto 29–1127 × 1072–1371 → 2:1 centrado
      card: { left: 0, top: 932, width: 1155, height: 578 },
    },
  },
  {
    id: 'alas-cessna',
    src: `${SRC}/p8-alas-cessna.png`,
    alt: 'Alas de piloto doradas con escudo esmaltado blanco y logotipo Cessna',
    crops: {
      // franja blanca: y 751–1748 (se deja fuera la barra del celular)
      full: { left: 0, top: 960, width: 1155, height: 616 },
      // objeto 46–1096 × 1132–1404 → 2:1 centrado
      card: { left: 0, top: 979, width: 1155, height: 578 },
    },
  },
  {
    id: 'pin-avion-dorado',
    src: `${SRC}/p4-pin-avion-dorado.jpg`,
    alt: 'Pin metálico de avión cuatrimotor en acabado dorado sobre tela gris',
    crops: {
      full: { left: 0, top: 0, width: 1875, height: 2500 },
      card: PIN_CARD,
    },
  },
  {
    id: 'pin-avion-plateado',
    src: `${SRC}/p5-pin-avion-plateado.jpg`,
    alt: 'Pin metálico de avión cuatrimotor en acabado plateado sobre tela gris',
    crops: {
      full: { left: 0, top: 0, width: 1875, height: 2500 },
      card: PIN_CARD,
    },
  },
  {
    id: 'pines-esmaltados',
    src: `${SRC}/p6-pines-avion-esmaltados.jpg`,
    alt: 'Pines esmaltados de avión blancos con cola azul y verde, agrupados sobre satén',
    crops: {
      full: { left: 0, top: 0, width: 1875, height: 2500 },
      // el pin del frente queda en el tercio inferior; se quita parte del satén de arriba
      card: { left: 40, top: 480, width: 1600, height: 2000 },
    },
  },
  {
    id: 'llavero-rbf',
    src: `${SRC}/p7-llaveros-remove-before-flight.jpg`,
    alt: 'Llavero rojo bordado «Remove Before Flight» sostenido en la mano, con más llaveros detrás',
    crops: {
      full: { left: 0, top: 0, width: 1875, height: 2500 },
      card: { left: 0, top: 156, width: 1875, height: 2344 },
    },
  },
];

// Anchos candidatos; se descartan los mayores que el recorte (nunca se amplía).
export const WIDTHS = [360, 540, 720, 960, 1280, 1600];
