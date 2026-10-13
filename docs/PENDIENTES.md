# Pendientes del cliente

Lo que el sitio NO muestra porque no está confirmado (regla del brief: no inventar).
Todo se completa en `src/data/catalogo.ts` y `src/lib/contacto.ts` sin rehacer la web.

## Fotos que faltan (prioridad alta)

Los productos principales no tienen foto. Hoy aparecen como filas tipográficas que piden
fotos, precio y tallas por WhatsApp:

- [ ] Uniforme clásico de piloto (camisa y pantalón)
- [ ] Uniforme táctico de aviación (camisa y pantalón)
- [ ] Presillas de piloto
- [ ] Corbatas
- [ ] Zapatos de piloto
- [ ] Aviones a escala (modelos disponibles)

Ideal: fondo liso claro, producto entero, luz pareja, mínimo 1500 px de ancho.

## Datos comerciales

- [ ] Precios (todos están en `null` → «consultar por WhatsApp»)
- [ ] Tallas de uniformes, presillas y zapatos
- [ ] Número de WhatsApp definitivo (el actual, 304 589 6779, es provisional)
- [ ] Dominio definitivo (hoy `andrestejada-aviationshop.vercel.app` como provisional en `astro.config.mjs`)
- [ ] Tiempos y costos de envío, transportadora
- [ ] Formas de pago
- [ ] Políticas de cambios y devoluciones, aviso de privacidad (si se publican, añadir sus páginas y enlazarlas en el footer)
- [ ] Ventas al por mayor (desactivadas: `MARCA.mayoristas = false`)

## Decisiones tomadas con el material real

- Las alas Piper y Cessna venían como capturas de celular: se recortó solo la franja blanca
  de la foto (sin retocar el producto).
- El pin metálico es un solo producto con dos acabados reales (dorado y plateado), cada uno
  con su foto.
- El logo se vectorizó del PNG original (fidelidad 98–99 %) para tener versión sobre negro;
  el negro del texto pasa a blanco sobre fondo oscuro. No se redibujó nada.
- Instagram: bloque estático con fotos locales y enlace al perfil (no hay autorización para
  la API; no se muestran cifras).
