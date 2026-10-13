# Andrés Tejada Aviation Shop

Tienda virtual de uniformes, accesorios y artículos de aviación (Colombia). Sitio estático en
**Astro 7** con CSS propio y ~3 KB de JavaScript. La venta se cierra por **WhatsApp** con el
producto ya escrito en el mensaje.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo en http://localhost:5500 |
| `npm run build` | Compila a `dist/` |
| `npm run preview` | Sirve `dist/` como en producción (http://localhost:5501) |
| `npm run check` | Tipos + build + verificación (enlaces, WhatsApp, imágenes, srcset) |
| `npm run assets` | Regenera fuentes, logo vectorizado/favicons/OG y fotos |

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Productos, categorías, precios, tallas | `src/data/catalogo.ts` |
| WhatsApp (provisional), Instagram, datos de la marca | `src/lib/contacto.ts` |
| Texto de los mensajes de WhatsApp | `src/lib/whatsapp.ts` |
| Fotos y sus recortes | `scripts/imagenes.config.mjs` → `npm run images` |
| Colores, tipografía, botones | `src/styles/global.css` |
| Dominio (canonical, OG, sitemap) | `astro.config.mjs` (o variable `SITE_URL` al compilar) |

### Agregar o completar un producto

1. **Foto nueva:** copiar el original a `_material-cliente/`, añadir la entrada en
   `scripts/imagenes.config.mjs` (id, archivo, recortes `full` y `card`) y correr
   `npm run images`.
2. En `src/data/catalogo.ts`, poner el id de la foto en `foto`. El producto pasa solo de
   «fila sin foto» a tarjeta con ficha propia (`/catalogo/<id>/`).
3. **Precio:** número en pesos sin puntos (`precio: 185000`). Se muestra formateado.
4. **Tallas:** lista (`tallas: ['S', 'M', 'L']`).
5. `npm run check`.

## Material del cliente

`_material-cliente/`: logo original (PNG), brief en PDF y las 6 fotos que traía el PDF
(extraídas con `pdfimages -all`, sin alterar). Ver `docs/PENDIENTES.md`.
