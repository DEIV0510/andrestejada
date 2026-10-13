// Interacción del sitio (≈3 KB): menú móvil, cabecera, sección activa, botón flotante,
// galones de las cabeceras y selector de variantes. Sin librerías.
// Todo lo que depende del scroll se mide con getBoundingClientRect en un rAF: los saltos
// de ancla no siempre disparan IntersectionObserver.
import { waProducto } from '@/lib/whatsapp';

const html = document.documentElement;

/* ───────────── Menú móvil ───────────── */
const boton = document.querySelector<HTMLButtonElement>('[data-menu-boton]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const textoBoton = boton?.querySelector<HTMLElement>('[data-menu-texto]');
const fuera = () =>
  [document.querySelector('main'), document.querySelector('footer'), document.querySelector('[data-flotante]'), document.querySelector('.saltar')].filter(
    Boolean,
  ) as HTMLElement[];
let cierre = 0;

function abrirMenu() {
  if (!boton || !menu) return;
  clearTimeout(cierre);
  menu.hidden = false;
  void menu.offsetWidth; // aplica el estado inicial antes de animar
  menu.classList.add('is-open');
  boton.setAttribute('aria-expanded', 'true');
  if (textoBoton) textoBoton.textContent = 'Cerrar';
  html.classList.add('is-menu');
  fuera().forEach((el) => (el.inert = true));
  menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  actualizar();
}

function cerrarMenu(devolverFoco = true) {
  if (!boton || !menu || menu.hidden) return;
  menu.classList.remove('is-open');
  boton.setAttribute('aria-expanded', 'false');
  if (textoBoton) textoBoton.textContent = 'Menú';
  html.classList.remove('is-menu');
  fuera().forEach((el) => (el.inert = false));
  cierre = window.setTimeout(() => (menu.hidden = true), 220);
  if (devolverFoco) boton.focus({ preventScroll: true });
  actualizar();
}

boton?.addEventListener('click', () => (menu?.hidden ? abrirMenu() : cerrarMenu()));
menu?.addEventListener('click', (e) => {
  // Al elegir un enlace: se libera el scroll ANTES de que el navegador salte al ancla.
  if ((e.target as Element).closest('a')) cerrarMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && !menu.hidden) cerrarMenu();
});
// Atrapa el foco dentro del cajón (botón Cerrar + enlaces).
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !menu || menu.hidden || !boton) return;
  const focos = [boton, ...menu.querySelectorAll<HTMLElement>('a, button')];
  const i = focos.indexOf(document.activeElement as HTMLElement);
  if (e.shiftKey && i <= 0) {
    e.preventDefault();
    focos[focos.length - 1].focus();
  } else if (!e.shiftKey && i === focos.length - 1) {
    e.preventDefault();
    focos[0].focus();
  }
});
matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
  if (e.matches) cerrarMenu(false);
});

/* ───────────── Scroll: cabecera, sección activa, flotante, galones ───────────── */
const header = document.querySelector<HTMLElement>('[data-header]');
const flotante = document.querySelector<HTMLElement>('[data-flotante]');
const heroCta = document.querySelector<HTMLElement>('[data-hero-cta]');
const footer = document.querySelector<HTMLElement>('[data-footer]');
const enlacesSpy = [...document.querySelectorAll<HTMLAnchorElement>('[data-spy]')];
// Solo en la portada (donde existe #inicio): en las fichas ningún enlace queda activo.
const secciones = document.getElementById('inicio')
  ? enlacesSpy.map((a) => document.getElementById(a.dataset.spy!)).filter((s): s is HTMLElement => !!s)
  : [];
const presillas = [...document.querySelectorAll<SVGElement>('.presilla--animada')];
let pendiente = false;

function actualizar() {
  pendiente = false;
  const alto = innerHeight;
  const y = scrollY;

  header?.classList.toggle('is-scrolled', y > 8);

  // Sección activa (solo en la portada, donde existen las secciones)
  if (secciones.length) {
    const linea = (header?.offsetHeight ?? 64) + alto * 0.3;
    let activa = secciones[0].id;
    for (const s of secciones) if (s.getBoundingClientRect().top <= linea) activa = s.id;
    if (innerHeight + y >= document.documentElement.scrollHeight - 4) activa = secciones[secciones.length - 1].id;
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

  // Galones de las cabeceras: crecen una vez al entrar en pantalla
  for (let i = presillas.length - 1; i >= 0; i--) {
    if (presillas[i].getBoundingClientRect().top < alto * 0.9) {
      presillas[i].classList.add('is-visible');
      presillas.splice(i, 1);
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

/* ───────────── Variantes (tarjetas y ficha) ───────────── */
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
  for (const img of raiz.querySelectorAll<HTMLImageElement>('[data-variante-foto]')) {
    img.closest('picture')?.classList.toggle('is-activa', img.dataset.varianteFoto === id);
  }
  const base = raiz.dataset.ficha || raiz.dataset.url || '';
  const url = `${base}?acabado=${id}`;
  const pedirEl = raiz.querySelector<HTMLAnchorElement>('[data-pedir]');
  if (pedirEl) pedirEl.href = waProducto({ nombre: raiz.dataset.nombre!, variante: opcion.dataset.enMensaje, url });
  const fichaEl = raiz.querySelector<HTMLAnchorElement>('[data-tarjeta-ficha]');
  if (fichaEl) fichaEl.href = `${new URL(base).pathname}?acabado=${id}`;
  if (raiz.matches('[data-ficha]')) history.replaceState(null, '', `?acabado=${id}`);
}

for (const grupo of document.querySelectorAll<HTMLElement>('[data-variantes]')) {
  const opciones = [...grupo.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
  grupo.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[role="radio"]');
    if (b) elegir(grupo, b);
  });
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
  if (grupo.closest('[data-ficha]')) {
    const pedido = new URLSearchParams(location.search).get('acabado');
    const op = opciones.find((o) => o.dataset.variante === pedido);
    if (op) elegir(grupo, op);
  }
}
