> Especificación de dirección de arte elegida por un panel de tres propuestas (instrumentos,
> editorial, insignia) y un juez. Base: «Cuatro galones». **Ajustes aplicados en la
> implementación** para cumplir el brief del cliente:
> - CTA principal del hero = EXPLORAR CATÁLOGO (dorado) y secundario = COMPRAR POR WHATSAPP,
>   como pide el brief.
> - Pantalla de carga con el logo, el nombre que aparece de izquierda a derecha y una línea
>   dorada de trayectoria que avanza solo con hitos reales (documento, tipografías, foto).
> - La sección de marca lleva una foto real (pin metálico dorado) y la franja de envíos.
> - Instagram tiene su propio bloque (fondo blanco) antes del footer.
> - Marcas de registro finas en el panel de la foto del hero (precisión, sin adorno).
> - Uniformes en escritorio: cabecera a la izquierda y filas a la derecha (composición variada).
> - Mensajes de WhatsApp con el texto del brief + enlace a la ficha.

# ANDRÉS TEJADA AVIATION SHOP — Especificación final «Cuatro galones»

## 1. Concepto y recurso central
La web se viste como un uniforme. El negro es el saco, el blanco es la camisa donde se prenden las insignias y el dorado es el galón. Hay un solo recurso: **la presilla**.

**La presilla.** Es un componente SVG en línea, `<Presilla n={1-4}/>`, con width y height escritos en los atributos.
- Forma: rectángulo de 48×16 con radio 0 y el extremo izquierdo cortado a 30° (el lado del cuello).
- Galones: #C6A13B, de 3×16, **de borde a borde**. No se dibujan como barras con margen interno, porque así parecen una pila. Van separados 3 px y empiezan a 4 px del extremo recto.
- Color: cuerpo #090909. Sobre fondo negro lleva además un contorno de 1 px #777.
- Número de galones por sección: Uniformes 1 · Accesorios 2 · Aviones a escala 3 · Marca 4. El 4 repite las 4 franjas del emblema. Nunca se escribe un rango.
- Solo aparece en:
  - el preloader (120×40);
  - el índice (48×16);
  - la cabecera de cada sección del catálogo (48×16, una por cabecera);
  - el bloque de marca (96×32).
- Nunca aparece en: header, footer, tarjetas, botones, fichas, fondos, patrones ni favicon. El favicon es el emblema.

## 2. Tokens
**Colores**
- `--negro` #090909: fondos oscuros, texto sobre blanco y botón PEDIR sobre blanco.
- `--blanco` #FFFFFF: catálogo, paneles de foto y texto sobre negro.
- `--dorado` #C6A13B:
  - galones;
  - botón principal de pedido, con texto negro (8,1:1);
  - contorno del flotante;
  - muestra «Dorado».
- `--dorado-claro` #E0C56A: hover del botón dorado y foco sobre negro.
- `--gris` #777777: hilos y contornos sobre negro. Como texto, solo a 24 px o más (da 4,45:1).
- `--texto-2` #5E5E5E: texto secundario pequeño sobre blanco (6,5:1).
- `--texto-2-osc` rgba(255,255,255,.72): texto secundario sobre negro.
- `--hilo` rgba(9,9,9,.16): filetes sobre blanco.
- Rellenos de hover: #F3F3F3 sobre blanco y #141414 sobre negro.
- Muestra «Plateado»: #BFC3C7. Es su único uso.

**Reglas del dorado**
- Plano: sin degradado, brillo ni glow.
- Como máximo un 5 % de cada pantalla.
- **Un solo botón dorado visible por pantalla.**
- **Nunca texto dorado sobre blanco**, porque da 2,4:1.

**Forma**
- `*,*::before,*::after{border-radius:0}`.
- Sin sombras, sin blur y sin degradados.
- Foco: outline de 2 px con offset de 2 px. Va en #090909 sobre blanco y en #E0C56A sobre negro.

**Espaciado y retícula**
- Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Contenedor de 1200 px, 12 columnas y medianil de 24.
- Márgenes: 64 px desde 1024, 40 px entre 768 y 1023.98, y 16 px por debajo de 768.
- Móvil: 4 columnas con medianil de 12.
- Secciones: 96 px de relleno vertical en escritorio y 56 en móvil.
- Media queries en 767.98px y 1023.98px, para no dejar un hueco de 1 px.

**Tipografía** (2 familias)
- Manrope variable (eje wght 200–800): se usan los pesos 600, 700 y 800.
- Inter variable (wght 100–900, opsz 14–32): se usan los pesos 400, 500 y 600, con font-optical-sizing en auto.
- Carga:
  - WOFF2 autoalojadas, subconjunto latin, `font-display: swap`;
  - solo se precarga Manrope;
  - fuente de respaldo Arial con size-adjust, ascent-override y descent-override medidos, para que el CLS quede en 0,02 o menos.
- La flecha → no está en el subconjunto latin: va como SVG de 12 px.
- Titulares en tipo frase. Nunca máscaras con overflow:hidden en titulares, porque cortan las tildes.

**Escala** (escritorio / móvil)

| Elemento | Fuente y peso | Tamaño | Interlínea | Tracking |
|---|---|---|---|---|
| H1 | Manrope 800 | 72 / clamp(34px,10vw,40px) | 1,0 | −0,03em |
| H2 de sección | Manrope 700 | 44 / 28 | 1,05 | −0,02em |
| H2 de marca | Manrope 700 | 56 / 30 | — | — |
| Fila de uniformes | Manrope 700 | 40 / 24 | — | — |
| Demás filas | Manrope 600 | 28 / 20 | — | — |
| Nombre en tarjeta | Manrope 600 | 18 / 16 | 1,2 | — |
| H1 de ficha | Manrope 700 | 48 / 30 | — | — |
| Usuario de Instagram | Manrope 800 | 44 / 28 | — | — |
| Cuerpo | Inter 400 | 17 / 16 (máx. 52ch) | 1,55 | — |
| Rótulo (mayúsculas) | Inter 600 | 12 / 11 | — | +0,12em |
| Botón (mayúsculas) | Inter 600 | 13; alto 52 / 48 | — | +0,12em |
| Teléfono | Inter 500 tnum | — | — | — |

## 3. Portada
**Orden:** Header → Hero → Índice → Uniformes → Accesorios → Aviones a escala → Marca (con envíos) → Footer (con contacto e Instagram). No hay más secciones.

**Header** (negro, sticky, sin blur; 72 px en escritorio y 56 en móvil)
- Logo oscuro compacto: emblema + ANDRES TEJADA + AVIATION SHOP, sin el descriptor. Mide 40 px de alto en escritorio y 32 en móvil. Si en móvil AVIATION SHOP queda con menos de 8 px de alto, hay que proponer al cliente la versión emblema + ANDRES TEJADA.
- **Escritorio:**
  - Menú: INICIO · UNIFORMES · ACCESORIOS · AVIONES A ESCALA · CONTACTO, en blanco al 72 %. Al pasar el cursor, blanco al 100 % con subrayado de 1 px.
  - Botón WhatsApp de 40×40, contorno blanco al 24 % y glifo blanco de 20 px.
- **Móvil:** logo · WhatsApp de 44×44 · botón de texto MENÚ/CERRAR con aria-expanded.
- **Cajón móvil:**
  - Va como hermano del header, no dentro de él.
  - Negro a pantalla completa, con los 5 enlaces en Manrope 700 de 28 px separados por hilos #777.
  - Abajo, el botón dorado a todo el ancho y @aviationshop_at.
  - Bloquea el scroll (el html lleva scrollbar-gutter: stable), se cierra con Esc, atrapa el foco y lo devuelve a MENÚ al cerrar.

**Hero**
- **Escritorio** (alto: min(100svh − 72px, 720px), con un mínimo de 560):
  - Columnas 1–6, fondo negro:
    - rótulo;
    - H1 en 2 líneas;
    - bajada en 1 línea (Inter 18, blanco al 72 %);
    - botón dorado COMPRAR POR WHATSAPP y botón con contorno blanco de 1 px EXPLORAR CATÁLOGO;
    - nota (Inter 13, blanco al 64 %).
  - Columnas 7–12, fondo blanco a sangre hasta el borde derecho:
    - las alas Piper al 78 % del panel (máx. 560 px), centradas al 44 % del alto;
    - abajo a la izquierda, a 24 px, el pie «Alas de piloto Piper — VER PIEZA →» en negro, enlazado a la ficha.
- **Móvil:**
  - Banda blanca de 390×176 (con aspect-ratio) y las alas al 84 % del ancho. La banda enlaza a la ficha.
  - Debajo, un bloque negro con rótulo, H1 en 2 líneas, bajada en 2 líneas, los dos botones apilados a todo el ancho (el dorado primero) y la nota.
  - Mide unos 600 px, así que cabe en el primer pantallazo.
- **LCP = la foto de las alas:**
  - `<link rel=preload as=image imagesrcset type=image/avif fetchpriority=high>`;
  - width y height declarados;
  - la foto no se anima nunca.

**Índice** (negro, separado del hero por un hilo #777)
- Escritorio: 3 celdas iguales de 96 px, separadas por hilos #777. Cada una lleva la presilla (1, 2 o 3 galones), el nombre en Manrope 600 de 24 px y una flecha.
- Enlaza a #uniformes, #accesorios y #aviones-a-escala.
- Móvil: 3 filas de 56 px. Sin carrusel ni pestañas.

**Cabecera de sección**
- Presilla, H2 y una línea en Inter 17 con color secundario.
- Usar `scroll-margin-top` de 72/56 px y nada más: no sumar scroll-padding.

**Uniformes** (fondo blanco): 2 filas de dotación.

**Accesorios** (fondo negro)
- Alas Piper y Alas Cessna en 2 celdas blancas 3:2 (6+6 columnas), unidas por un hilo #777. En móvil van apiladas, también en 3:2.
- Debajo, 3 filas de dotación: Presillas de piloto, Corbatas y Zapatos de piloto.

**Aviones a escala** (fondo blanco)
- H2: «Aviones a escala y coleccionismo».
- Primero va la fila Aviones a escala.
- Después, el subrótulo COLECCIONISMO y 3 celdas 4:5 (4+4+4): Pin avión metálico, Pin avión esmaltado y Llavero.
- En móvil: los dos pines en 2 columnas y el llavero ocupando 2 columnas en 4:3, con object-fit cover y object-position 50% 38% sobre el mismo archivo.

**Tarjeta con foto**
- Celdas pegadas con filetes de 1 px, sin separación ni sombra.
- La foto enlaza a la ficha.
- Debajo, una tira de 56 px partida por un filete: [nombre, máx. 2 líneas] | [PEDIR].
- PEDIR mide 96 px de ancho y abre WhatsApp:
  - sobre blanco: fondo negro y texto blanco;
  - sobre negro: contorno blanco al 24 % y texto blanco. Al pasar el cursor se rellena de dorado con texto negro.
- En móvil: el nombre arriba (16 px, recortado a 2 líneas en un span interno sin padding) y PEDIR como barra de 44 px a todo el ancho.
- El pin metálico lleva dos cuadrados de 12 px (#C6A13B y #BFC3C7) con aria-label «Acabados: dorado y plateado».
- Sin precio, etiquetas ni estrellas.

**Fila de dotación** (productos sin foto)
- La fila entera es un enlace a WhatsApp.
- **Escritorio:**
  - Alto de 136 px en uniformes y 88 px en el resto.
  - Hilos: sobre blanco, la lista abre y cierra con 1 px #090909 y lleva `--hilo` entre filas. Sobre negro, todos los hilos son #777.
  - A la izquierda, el nombre y una línea secundaria.
  - A la derecha, la acción como rótulo con flecha.
- **Móvil:** alto mínimo de 64 px, el nombre y la línea apilados, y «PEDIR →» a la derecha.
- Hover: fondo #F3F3F3 o #141414, y la flecha avanza 4 px.
- Sin recuadros, iconos, siluetas, ilustraciones ni «imagen próximamente».
- **Cuando llegue una foto real:** en `src/data/catalogo.ts`, `foto: null` pasa a ser el archivo y el producto se convierte en tarjeta. No hay que tocar la retícula.

**Marca** (fondo negro; relleno vertical de 128 px en escritorio y 80 en móvil; columnas 1–8)
- Presilla de 4 galones (96 px), rótulo, H2 en 2 líneas y botón dorado.
- Un hilo #777 y debajo la franja estática de envíos. En móvil, un dato por línea.
- Sin fotos y sin párrafo.

**Footer** (fondo negro, id «contacto»)
- **Fila superior:** rótulo INSTAGRAM, @aviationshop_at como enlace, la bio real en 1 línea y un botón con contorno. Sin feed ni cifras.
- **Columnas:**
  - Logo oscuro: completo solo si el descriptor queda con 9 px de alto o más. Si no, el compacto con el descriptor como texto real (Inter 600 de 11 px).
  - CATÁLOGO: 3 enlaces.
  - CONTACTO: WhatsApp «+57 304 589 6779» con espacios duros, Instagram y la línea de tienda virtual.
- **Base:** el copyright en Inter 12, blanco al 64 %.
- Sin dirección, mapa, NIT ni políticas.
- **El número sale de una sola constante** en `src/lib/contacto.ts`, porque es provisional.

**Botón flotante de WhatsApp**
- Cuadrado negro de 56×56 (52 en móvil), contorno dorado de 1 px y glifo blanco de 26 px.
- Abajo a la derecha, a 16 px en móvil y 24 en escritorio, más el área segura.
- Aparece cuando los botones del hero salen por arriba. Se mide con el scroll en rAF, no con IntersectionObserver, que no detecta los saltos de ancla.
- Se oculta con el menú abierto, cuando el footer entra en pantalla y en todas las fichas.
- Es un `<a target=_blank rel=noopener>`; nunca window.open.

## 4. Fichas (solo los 5 productos con foto)
**Rutas:** /catalogo/alas-de-piloto-piper/, /catalogo/alas-de-piloto-cessna/, /catalogo/pin-avion-metalico, /catalogo/pin-avion-esmaltado y /catalogo/llavero-remove-before-flight. Los productos sin foto no tienen ficha.

**Escritorio**
- Foto en las columnas 1–7: 4:5, salvo las alas, que van en 3:2 sobre blanco.
- Columnas 9–12, en orden:
  - la ruta «CATÁLOGO / ACCESORIOS»;
  - el H1;
  - una línea;
  - el selector, si el producto lo tiene;
  - la nota;
  - el botón dorado de 56 px a todo el ancho;
  - «Volver al catálogo».
- Las fichas de Piper y Cessna se enlazan entre sí.

**Selector de acabado** (solo el pin metálico; las dos variantes son reales)
- Rótulo ACABADO y dos botones rectangulares de 44 px de alto y al menos 120 de ancho: Dorado y Plateado. Contorno de 1 px negro; el activo, relleno de negro.
- Funciona como radiogroup: se mueve con las flechas del teclado.
- Al cambiar de acabado:
  - las dos fotos, apiladas y del mismo tamaño, se funden (CLS 0);
  - se actualiza el mensaje de WhatsApp;
  - con replaceState se pone `?acabado=plateado`, así que el enlace compartido abre el acabado correcto.
- Sin JavaScript se ve el dorado y el mensaje va sin acabado.

**Móvil**
- Foto en 1:1 (aspect-ratio con object-fit cover sobre el mismo archivo).
- El nombre, la línea y el selector caben en el primer pantallazo.
- Barra fija inferior negra de 64 px más el área segura, con el botón dorado. El flotante no aparece.

## 5. Fotos (solo las 6 reales)
**Proceso**
- Los recortes se hacen con `tools/recortes.mjs` (sharp) a partir de los originales.
- Salida en AVIF y WebP con `<Picture>` de astro:assets, en tamaños 480, 768 y 1080, sin pasar del ancho del recorte.
- width y height siempre declarados. Sin filtros ni recoloreado.

**Recortes** (coordenadas medidas a ojo: confirmar con trim, ±20 px)
- **Alas Piper:** el archivo mide 1155×2500 y conserva las barras negras de la captura. Recorte de 1155×425 en y 1010–1435. Si el fondo queda por debajo de 252, nivelar solo el blanco a #FFFFFF para que se funda con el panel.
- **Alas Cessna:** también tiene el indicador de inicio del iPhone. Recorte de 1155×425 en y 1053–1478.
- **Pin dorado:** 1250×1562 en x 345–1595, y 639–2201. El avión ocupa cerca del 50 % del ancho.
- **Pin plateado:** mismo tamaño, centrado en su avión: x 322–1572, y 685–2247.
- **Pines esmaltados:** 1600×2000 en x 40–1640, y 480–2480. Se elimina el tercio superior de satén.
- **Llavero:** 1875×2344 en y 60–2404. Se conserva la mano.

## 6. Motion (lista cerrada)
**1. Preloader**
- **Cuándo se muestra:** solo en la portada y en la primera visita, cuando:
  - la marca `at_intro` no está en localStorage (con try/catch; si falla, no hay intro);
  - no hay prefers-reduced-motion;
  - no hay saveData ni conexión 2g o 3g.
- **Activación:** un script en línea en el head pone `html.is-intro` antes del primer pintado y guarda la marca.
- **Fotograma 0:** capa #090909 con la presilla de 120×40 (contorno #777) y el rótulo «ANDRES TEJADA · AVIATION SHOP» (Inter 600 de 11 px, blanco al 72 %). Los dos se ven desde el primer fotograma: si todo arranca invisible, Chrome deja la pantalla en blanco.
- **80–500 ms:** los 4 galones crecen con scaleY de 0 a 1 desde abajo, 180 ms cada uno, escalonados cada 80 ms, con cubic-bezier(.2,.7,.2,1).
- **Salida:**
  - La decide el script del head: cuando readyState sea «interactive» y hayan pasado al menos 550 ms desde el primer rAF, añade `is-intro-out`.
  - La capa sale con clip-path de inset(0) a inset(0 0 100% 0) en 320 ms, con cubic-bezier(.7,0,.2,1), y después se elimina el nodo.
  - Duración total: unos 0,9–1,0 s.
- **Tope de 1,4 s:**
  - una animación CSS de salida con 1,08 s de retraso cierra la capa aunque falle el JS;
  - un setTimeout de 1400 ms quita la clase.
  - La salida no espera fuentes, fotos ni el bundle.
- **Lo que no hace:** sin porcentajes y sin bloquear el scroll. El hero está pintado debajo con opacidad 1.
- **Medición:** LCP con y sin intro, usando playwright-core + CDP con reducedMotion «no-preference», 4G lenta y CPU 4x. La diferencia debe ser de 200 ms o menos.

**2. Galones de cabecera**
- Una sola vez, al entrar en pantalla: scaleY de 0 a 1 en 220 ms, escalonados cada 70 ms, con cubic-bezier(.2,.7,.2,1).
- El estado inicial depende de `html.is-js`. Si al cargar la cabecera ya pasó (por un ancla), los galones aparecen completos.
- Reduced motion: estáticos.
- Los galones del índice no se animan.

**3. Foto de tarjeta al pasar el cursor** (solo con pointer:fine)
- scale de 1 a 1,03 en 400 ms, con cubic-bezier(.2,.8,.2,1).
- Reduced motion: no hay animación.

**4. Botones**
- Una capa ::before pasa de opacity 0 a 1 en 160 ms, linear:
  - dorado → #E0C56A;
  - negro → #262626;
  - contorno → blanco al 10 %.
- Igual con reduced motion.

**5. Flecha**
- translateX de 0 a 4 px en 200 ms, ease-out.
- Reduced motion: no hay animación.

**6. Subrayado de los enlaces del menú**
- scaleX de 0 a 1 desde la izquierda, 200 ms, ease-out.
- Reduced motion: aparece sin transición.

**7. Cajón móvil**
- Apertura: clip-path de inset(0 0 100% 0) a inset(0) en 280 ms, con cubic-bezier(.2,.8,.2,1). Los enlaces pasan de opacity 0 a 1 en 180 ms, escalonados cada 30 ms.
- Cierre: 200 ms, ease-in.
- Reduced motion: solo opacity, 120 ms.

**8. Cambio de acabado**
- Fundido de opacity en 200 ms, ease.
- Reduced motion: instantáneo.

**9. Botón flotante**
- opacity y translateY de 8 px a 0 en 200 ms, ease-out.
- Reduced motion: solo opacity.

## 7. Microcopy definitiva
**Hero**
- Rótulo: UNIFORMES · ACCESORIOS · AVIONES A ESCALA
- H1: El estándar de tu vocación.
- Bajada: Uniformes y accesorios para quienes llevan la aviación en su esencia.
- Botones: COMPRAR POR WHATSAPP / EXPLORAR CATÁLOGO
- Nota: Envíos a toda Colombia.
- Pie de foto: Alas de piloto Piper — VER PIEZA

**Índice:** Uniformes / Accesorios / Aviones a escala

**Secciones**
- Uniformes — Camisa y pantalón, en línea clásica o táctica.
- Accesorios — Alas, presillas, corbatas y zapatos de piloto.
- Aviones a escala y coleccionismo — Modelos a escala, pines y llaveros de aviación.
- Subrótulo: COLECCIONISMO

**Filas** (nombre — línea — acción)
- Uniforme clásico de piloto — Camisa y pantalón. — PEDIR POR WHATSAPP
- Uniforme táctico de aviación — Camisa y pantalón. — PEDIR POR WHATSAPP
- Presillas de piloto — Modelos y tallas por WhatsApp. — PEDIR POR WHATSAPP
- Corbatas — Modelos por WhatsApp. — PEDIR POR WHATSAPP
- Zapatos de piloto — Modelos y tallas por WhatsApp. — PEDIR POR WHATSAPP
- Aviones a escala — Consulta los modelos disponibles. — PREGUNTAR MODELOS

**Tarjetas**
- Botón: PEDIR

**Fichas** (una línea por producto)
- Alas de piloto Piper: Alas doradas con escudo esmaltado Piper.
- Alas de piloto Cessna: Alas doradas con escudo esmaltado Cessna.
- Pin avión metálico: Avión cuatrimotor en metal. Dorado o plateado.
- Pin avión esmaltado: Avión esmaltado en blanco, azul y verde.
- Llavero Remove Before Flight: Cinta roja bordada con argolla metálica.
- Selector: ACABADO — Dorado / Plateado
- Nota: Disponibilidad y valor se confirman por WhatsApp.
- Botón: PEDIR POR WHATSAPP
- Enlaces: Volver al catálogo · Ver también: Alas de piloto Cessna

**Marca**
- Rótulo: TU VOCACIÓN MERECE ESTAR A LA ALTURA
- H2: Más que un uniforme. / Una forma de representar tu vocación.
- Botón: COMPRAR POR WHATSAPP
- Franja: ENVÍOS A TODA COLOMBIA · TIENDA VIRTUAL · PEDIDOS POR WHATSAPP

**Footer**
- INSTAGRAM · @aviationshop_at
- Bio: Accesorios & Uniformes Aeronáuticos · Envíos a toda Colombia
- Botón: SEGUIR EN INSTAGRAM
- Columnas: CATÁLOGO · CONTACTO
- Tienda virtual · Envíos a toda Colombia
- © 2026 Andrés Tejada Aviation Shop

**Utilidades**
- Menú: MENÚ / CERRAR
- aria del flotante: Escribir por WhatsApp
- 404: Página no encontrada. / VOLVER AL CATÁLOGO

**Mensajes de WhatsApp** (con encodeURIComponent en el build)
- General: «Hola, quiero información sobre los productos de Andrés Tejada Aviation Shop.»
- Producto con foto: «Hola, me interesa: {nombre}{ — acabado {X}}. Lo vi aquí: {url}»
- Fila: «Hola, me interesa: {nombre}. ¿Qué modelos y tallas tienen?» En corbatas, «¿Qué modelos tienen?».
- Aviones a escala: «Hola, quiero saber qué modelos de aviones a escala tienen.»

## 8. Técnica
- **Astro:** output static, base '/' y scopedStyleStrategy 'class', para que los SVG hijos no salgan sin estilo.
- **JS:**
  - un script en línea en el head, de alrededor de 1 KB, con is-js e intro;
  - un módulo de alrededor de 3 KB con el menú, el flotante, los galones y el selector;
  - sin librerías.
- `[hidden]{display:none!important}`.
- Las clases de estado llevan el prefijo is- (is-js, is-intro, is-intro-out, is-menu).
- **Metas:** Lighthouse móvil de 90 o más y CLS de 0,02 o menos.

## 9. Lo que NO se hace
- No se muestran precios, tallas confirmadas, tiempos de entrega, políticas, reseñas, años de experiencia, ventas al por mayor ni cifras de seguidores.
- No se usan certificaciones, alianzas, aerolíneas, direcciones ni coordenadas. Piper y Cessna solo nombran el artículo, nunca como sello.
- No hay fotos de stock, generadas con IA ni ilustraciones de producto. Tampoco siluetas ni marcadores de «próximamente».
- No hay carrito, buscador, cuenta ni pasarela.
- No se usan esquinas redondeadas, sombras, glassmorphism, degradados, brillos, emojis ni iconos decorativos. Los únicos iconos son WhatsApp, Instagram y la flecha.
- No hay bloques de «por qué elegirnos», contadores, marquesinas ni feeds incrustados.
- No hay revelados al hacer scroll, parallax, bucles infinitos, scroll secuestrado ni cursor propio.
- No hay rangos escritos, patrones de galones ni la presilla fuera de sus 4 lugares.
- No se usan dos botones dorados en la misma pantalla.