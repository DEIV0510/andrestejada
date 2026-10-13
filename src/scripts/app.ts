// Interacción del sitio (≈4 KB): menú móvil, cabecera, sección activa, botón flotante,
// galones de las cabeceras, revelado de fotos y opciones de producto. Sin librerías.
// Lo que depende del scroll se mide con getBoundingClientRect en un rAF: los saltos de
// ancla no siempre disparan IntersectionObserver.
import { waProducto } from '@/lib/whatsapp';

const html = document.documentElement;
// El módulo arrancó: desde aquí pueden ocultarse cosas que el script se encarga de mostrar.
html.classList.add('is-app');

/* ───────────── Menú móvil ───────────── */
const boton = document.querySelector<HTMLAnchorElement>('[data-menu-boton]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const textoBoton = boton?.querySelector<HTMLElement>('[data-menu-texto]');
const fuera = () =>
  [document.querySelector('main'), document.querySelector('footer'), document.querySelector('[data-flotante]'), document.querySelector('.saltar')].filter(
    Boolean,
  ) as HTMLElement[];
const abierto = () => !!menu?.classList.contains('is-open');

function abrirMenu() {
  if (!boton || !menu) return;
  menu.classList.add('is-open');
  boton.setAttribute('aria-expanded', 'true');
  if (textoBoton) textoBoton.textContent = 'Cerrar';
  html.classList.add('is-menu');
  fuera().forEach((el) => (el.inert = true));
  // El cajón pasa a visible en el siguiente fotograma: enfocar después.
  setTimeout(() => menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }), 60);
  actualizar();
}

function cerrarMenu(devolverFoco = true) {
  if (!boton || !menu || !abierto()) return;
  menu.classList.remove('is-open');
  boton.setAttribute('aria-expanded', 'false');
  if (textoBoton) textoBoton.textContent = 'Menú';
  html.classList.remove('is-menu');
  fuera().forEach((el) => (el.inert = false));
  if (devolverFoco) boton.focus({ preventScroll: true });
  actualizar();
}

// MENÚ es un enlace a #menu-movil (funciona sin JS con :target); con JS, es un botón.
boton?.addEventListener('click', (e) => {
  e.preventDefault();
  if (abierto()) cerrarMenu();
  else abrirMenu();
});
boton?.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
    boton.click();
  }
});
menu?.addEventListener('click', (e) => {
  // Al elegir un enlace: se libera el scroll ANTES de que el navegador salte al ancla.
  if ((e.target as Element).closest('a')) cerrarMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && abierto()) cerrarMenu();
  // Foco atrapado dentro del cajón (botón Cerrar + enlaces)
  if (e.key === 'Tab' && abierto() && menu && boton) {
    const focos = [boton, ...menu.querySelectorAll<HTMLElement>('a, button')];
    const i = focos.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && i <= 0) {
      e.preventDefault();
      focos[focos.length - 1].focus();
    } else if (!e.shiftKey && i === focos.length - 1) {
      e.preventDefault();
      focos[0].focus();
    }
  }
});
matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
  if (e.matches) cerrarMenu(false);
});
if (location.hash === '#menu-movil') history.replaceState(null, '', location.pathname + location.search);

/* ───────────── Scroll: cabecera, sección activa, flotante, galones, fotos ───────────── */
const header = document.querySelector<HTMLElement>('[data-header]');
const flotante = document.querySelector<HTMLElement>('[data-flotante]');
const heroCta = document.querySelector<HTMLElement>('[data-hero-cta]');
const footer = document.querySelector<HTMLElement>('[data-footer]');
const enlacesSpy = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
// Solo en la portada (donde existe #inicio): en las fichas ningún enlace queda activo.
const ids = [...new Set(enlacesSpy.map((a) => a.dataset.spy!))];
const secciones = document.getElementById('inicio')
  ? ids.map((id) => document.getElementById(id)).filter((s): s is HTMLElement => !!s)
  : [];
const pendientesDeVer = [...document.querySelectorAll<Element>('.presilla--animada, .revela')];
let pendiente = false;

function actualizar() {
  pendiente = false;
  const alto = innerHeight;
  const y = scrollY;

  header?.classList.toggle('is-scrolled', y > 8);

  // Sección activa: la última cuyo borde superior pasó la línea de lectura y cuyo final
  // aún no la ha pasado. Entre secciones del menú (marca, Instagram) no hay ninguna activa.
  if (secciones.length) {
    const linea = (header?.offsetHeight ?? 64) + alto * 0.3;
    let activa: string | null = null;
    for (const s of secciones) {
      const r = s.getBoundingClientRect();
      if (r.top <= linea && r.bottom > linea) activa = s.id;
    }
    const pie = footer?.getBoundingClientRect();
    if (pie && pie.top < alto * 0.8) activa = 'contacto';
    for (const a of enlacesSpy) {
      if (a.dataset.spy === activa) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  }

  // Botón flotante: tras los botones del hero, sin footer a la vista, sin menú abierto
  if (flotante) {
    const pasado = heroCta ? heroCta.getBoundingClientRect().bottom < 0 : y > 240;
    const pie = footer ? footer.getBoundingClientRect().top < alto - 40 : false;
    flotante.classList.toggle('is-visible', pasado && !pie && !html.classList.contains('is-menu'));
  }

  // Galones de las cabeceras y fotos: aparecen una vez al entrar en pantalla
  for (let i = pendientesDeVer.length - 1; i >= 0; i--) {
    if (pendientesDeVer[i].getBoundingClientRect().top < alto * 0.92) {
      pendientesDeVer[i].classList.add('is-visible');
      pendientesDeVer.splice(i, 1);
    }
  }
}

const pedir = () => {
  if (!pendiente) {
    pendiente = true;
    requestAnimationFrame(actualizar);
  }
};
addEventListener('scroll', pedir, { passive: true });
addEventListener('resize', pedir, { passive: true });
addEventListener('hashchange', pedir);
addEventListener('load', pedir);
actualizar();

/* ───────────── Opciones de producto (tarjetas y ficha) ───────────── */
// Carga una foto diferida (variante que aún no se había pedido).
function cargar(foto: Element | null) {
  if (!foto) return;
  for (const s of foto.querySelectorAll<HTMLSourceElement>('source[data-srcset]')) {
    s.srcset = s.dataset.srcset!;
    s.removeAttribute('data-srcset');
  }
  const img = foto.querySelector<HTMLImageElement>('img[data-src]');
  if (img) {
    img.src = img.dataset.src!;
    img.removeAttribute('data-src');
  }
}

function mensaje(raiz: HTMLElement) {
  const elegidas = [...raiz.querySelectorAll<HTMLButtonElement>('[data-variantes] [aria-checked="true"]')];
  const variante = elegidas.map((b) => b.dataset.enMensaje).join(', ') || null;
  const acabado = raiz.querySelector<HTMLButtonElement>('[data-param="acabado"] [aria-checked="true"]');
  const base = raiz.dataset.url!;
  const url = acabado ? `${base}?acabado=${acabado.dataset.variante}` : base;
  const pedirEl = raiz.querySelector<HTMLAnchorElement>('[data-pedir]');
  if (pedirEl) pedirEl.href = waProducto({ nombre: raiz.dataset.nombre!, variante, url });
}

function elegir(grupo: HTMLElement, opcion: HTMLButtonElement, enfocar = false) {
  const raiz = grupo.closest<HTMLElement>('[data-tarjeta], [data-ficha]');
  if (!raiz) return;
  const id = opcion.dataset.variante!;
  for (const b of grupo.querySelectorAll<HTMLButtonElement>('[role="radio"]')) {
    const on = b === opcion;
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  }
  if (enfocar) opcion.focus();

  if (grupo.dataset.param === 'acabado') {
    // Foto: solo la elegida queda visible y en el árbol accesible.
    for (const foto of raiz.querySelectorAll<HTMLElement>('[data-variante-foto]')) {
      const on = foto.dataset.varianteFoto === id;
      if (on) cargar(foto);
      foto.classList.toggle('is-activa', on);
      if (on) foto.removeAttribute('aria-hidden');
      else foto.setAttribute('aria-hidden', 'true');
    }
    const texto = raiz.querySelector('[data-variante-texto]');
    if (texto) texto.textContent = opcion.dataset.nombre ?? '';
    const fichaEl = raiz.querySelector<HTMLAnchorElement>('[data-tarjeta-ficha]');
    if (fichaEl) fichaEl.href = `${new URL(raiz.dataset.url!).pathname}?acabado=${id}`;
    // Solo la ficha guarda la elección en su URL (la portada conserva su ancla).
    if (raiz.matches('[data-ficha]')) history.replaceState(null, '', `${location.pathname}?acabado=${id}`);
  }
  mensaje(raiz);
}

for (const grupo of document.querySelectorAll<HTMLElement>('[data-variantes]')) {
  const opciones = [...grupo.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
  grupo.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[role="radio"]');
    if (b) elegir(grupo, b);
  });
  // Adelanta la descarga de la foto de una variante al apuntarla o enfocarla.
  const anticipar = (e: Event) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[role="radio"]');
    const raiz = grupo.closest('[data-tarjeta], [data-ficha]');
    if (b && raiz && grupo.dataset.param === 'acabado') cargar(raiz.querySelector(`[data-variante-foto="${b.dataset.variante}"]`));
  };
  grupo.addEventListener('pointerover', anticipar);
  grupo.addEventListener('focusin', anticipar);
  grupo.addEventListener('keydown', (e) => {
    const i = opciones.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    let j = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % opciones.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + opciones.length) % opciones.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = opciones.length - 1;
    if (j >= 0) {
      e.preventDefault();
      elegir(grupo, opciones[j], true);
    }
  });
  // Ficha: abre el acabado pedido en la URL (?acabado=plateado)
  if (grupo.closest('[data-ficha]') && grupo.dataset.param) {
    const pedido = new URLSearchParams(location.search).get(grupo.dataset.param);
    const op = opciones.find((o) => o.dataset.variante === pedido);
    if (op) elegir(grupo, op);
  }
}
