'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import CircularCarousel, { type CircularCarouselItem } from '@/components/CircularCarousel';
import type { Producto } from '@/data/tipos';
import { descriptorPrenda, escasezCritica, precioCOP, textoExistencias } from '@/lib/formato';
import SlideFotos from './SlideFotos';

/**
 * El stock de una colección en el Circular Carousel de React Bits, con la
 * apertura del Flex Carousel construida encima.
 *
 * Son dos componentes distintos: el focusOnClick del Circular solo gira la
 * tarjeta al frente, no la abre. La apertura es esta capa: al hacer clic, la
 * tarjeta vuela desde donde está hasta el centro y crece, mientras el anillo se
 * abre hacia afuera y se desvanece. Se cierra con clic, arrastre, rueda o Escape.
 */

const ASPECTO = 0.75;
const DURACION = 640; // ms
const CURVA = 'cubic-bezier(0.22, 1, 0.36, 1)';
const UMBRAL_ARRASTRE = 8; // px de movimiento que cuentan como arrastre

type Fase = 'abriendo' | 'abierto' | 'cerrando';

interface Apertura {
  indice: number;
  desde: DOMRect;
  fase: Fase;
}

interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Dónde termina la tarjeta abierta: centrada, dejando sitio para la ficha. */
function cajaAbierta(): Caja {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let h = Math.min(vh * 0.68, 720);
  let w = h * ASPECTO;
  const anchoMax = vw * 0.86;
  if (w > anchoMax) {
    w = anchoMax;
    h = w / ASPECTO;
  }
  return { x: (vw - w) / 2, y: (vh - h) / 2 - 44, w, h };
}

/** Transforma la caja abierta para que coincida con un rectángulo en pantalla. */
function transformHacia(caja: Caja, r: DOMRect): string {
  const sx = r.width / caja.w;
  const sy = r.height / caja.h;
  return `translate(${r.left - caja.x}px, ${r.top - caja.y}px) scale(${sx}, ${sy})`;
}

export default function CarruselColeccion({ productos }: { productos: Producto[] }) {
  const anillo = useRef<HTMLDivElement>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const velo = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDivElement>(null);

  const [apertura, setApertura] = useState<Apertura | null>(null);
  const [caja, setCaja] = useState<Caja | null>(null);
  const [foto, setFoto] = useState(0);
  const [menosMovimiento, setMenosMovimiento] = useState(false);

  useEffect(() => {
    setMenosMovimiento(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Solo entran al anillo las prendas con foto: una tarjeta vacía no aporta.
  const conFoto = useMemo(
    () => productos.filter((p) => p.imagenes.length > 0),
    [productos]
  );

  const items = useMemo<CircularCarouselItem[]>(
    () =>
      conFoto.map((p) => {
        const foto = p.imagenes.find((i) => i.principal) ?? p.imagenes[0];
        return {
          src: foto.src,
          alt: foto.alt,
          title: p.nombre,
          subtitle: descriptorPrenda(p),
        };
      }),
    [conFoto]
  );

  /** Rectángulo actual en pantalla de la tarjeta del anillo con ese índice. */
  const rectDeTarjeta = useCallback((indice: number): DOMRect | null => {
    const el = anillo.current?.querySelector(
      `[data-cc-index="${indice}"] .circular-carousel__frame`
    );
    return el ? el.getBoundingClientRect() : null;
  }, []);

  /* ---------- Abrir ---------- */

  const abrir = useCallback(
    (_item: CircularCarouselItem, indice: number) => {
      if (apertura) return;
      // Se mide en el mismo instante del clic, antes de que el anillo gire.
      const desde = rectDeTarjeta(indice);
      if (!desde) return;
      setFoto(0);
      setCaja(cajaAbierta());
      setApertura({ indice, desde, fase: 'abriendo' });
    },
    [apertura, rectDeTarjeta]
  );

  // FLIP: la tarjeta abierta se coloca en su sitio final, se desplaza
  // visualmente hasta donde estaba la del anillo, y desde ahí se anima a cero.
  useLayoutEffect(() => {
    const el = tarjeta.current;
    if (!el || !apertura || !caja || apertura.fase !== 'abriendo') return;

    const fondo = velo.current;

    el.style.transition = 'none';
    el.style.transform = transformHacia(caja, apertura.desde);
    void el.offsetWidth; // fuerza el reflow para que la transición arranque desde aquí

    el.style.transition = menosMovimiento ? 'none' : `transform ${DURACION}ms ${CURVA}`;
    el.style.transform = 'none';
    if (fondo) {
      fondo.style.transition = menosMovimiento ? 'none' : `opacity ${DURACION}ms ${CURVA}`;
      fondo.style.opacity = '0.94';
    }

    const listo = window.setTimeout(
      () => setApertura((a) => (a ? { ...a, fase: 'abierto' } : a)),
      menosMovimiento ? 0 : DURACION
    );
    return () => window.clearTimeout(listo);
  }, [apertura, caja, menosMovimiento]);

  /* ---------- Cerrar ---------- */

  const cerrar = useCallback(() => {
    const el = tarjeta.current;
    if (!el || !caja || !apertura || apertura.fase !== 'abierto') return;

    setApertura({ ...apertura, fase: 'cerrando' });
    // Vuelve a la foto principal antes de volar al anillo: la tarjeta del anillo
    // muestra la principal, y aterrizar con otra foto se notaría como un salto.
    setFoto(0);

    // Vuelve a donde esté ahora la tarjeta: el anillo pudo haberla girado al
    // frente. Si ya no se ve, se desvanece en el sitio en vez de volar a la nada.
    const destino = rectDeTarjeta(apertura.indice);
    const visible =
      destino &&
      destino.width > 20 &&
      destino.right > 0 &&
      destino.left < window.innerWidth;

    el.style.transition = menosMovimiento
      ? 'none'
      : `transform ${DURACION}ms ${CURVA}, opacity ${DURACION}ms ${CURVA}`;
    if (visible) el.style.transform = transformHacia(caja, destino);
    else el.style.opacity = '0';
    if (velo.current) velo.current.style.opacity = '0';

    window.setTimeout(
      () => {
        setApertura(null);
        setCaja(null);
        anillo.current?.querySelector<HTMLElement>('.circular-carousel')?.focus();
      },
      menosMovimiento ? 0 : DURACION
    );
  }, [apertura, caja, menosMovimiento, rectDeTarjeta]);

  const producto = apertura ? conFoto[apertura.indice] : null;

  // La principal va primero: es la que muestra el anillo, así que el vuelo de
  // apertura empieza y el de cierre termina sobre la misma imagen.
  const fotos = useMemo(() => {
    if (!producto) return [];
    const principal = producto.imagenes.find((i) => i.principal) ?? producto.imagenes[0];
    return [principal, ...producto.imagenes.filter((i) => i !== principal)];
  }, [producto]);
  const totalFotos = fotos.length;

  // Mientras está abierta: Escape, rueda o arrastre la cierran. Sobre la foto,
  // en cambio, deslizar y la rueda horizontal pasan de foto.
  useEffect(() => {
    if (apertura?.fase !== 'abierto') return;

    dialogo.current?.focus();

    let origen: { x: number; y: number } | null = null;
    let ultimaRueda = 0;

    const sobreLaFoto = (objetivo: EventTarget | null) =>
      objetivo instanceof Node && Boolean(tarjeta.current?.contains(objetivo));

    const pasar = (paso: number) => {
      if (totalFotos < 2) return;
      setFoto((i) => (i + paso + totalFotos) % totalFotos);
    };

    const onTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
      else if (e.key === 'ArrowRight') pasar(1);
      else if (e.key === 'ArrowLeft') pasar(-1);
    };
    const onRueda = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (horizontal && sobreLaFoto(e.target)) {
        // Un gesto de trackpad dispara decenas de eventos: uno por foto basta.
        const ahora = performance.now();
        if (ahora - ultimaRueda > 450 && Math.abs(e.deltaX) > 8) {
          ultimaRueda = ahora;
          pasar(e.deltaX > 0 ? 1 : -1);
        }
        return;
      }
      cerrar();
    };
    const onDown = (e: PointerEvent) => {
      // Sobre la foto, el arrastre lo maneja el slide.
      origen = sobreLaFoto(e.target) ? null : { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: PointerEvent) => {
      if (!origen) return;
      if (Math.hypot(e.clientX - origen.x, e.clientY - origen.y) > UMBRAL_ARRASTRE) {
        origen = null;
        cerrar();
      }
    };
    const onUp = () => {
      origen = null;
    };
    const onResize = () => setCaja(cajaAbierta());

    window.addEventListener('keydown', onTecla);
    window.addEventListener('wheel', onRueda, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onTecla);
      window.removeEventListener('wheel', onRueda);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, [apertura?.fase, cerrar, totalFotos]);

  const abiertoDelTodo = apertura?.fase === 'abierto';
  const separado = apertura !== null && apertura.fase !== 'cerrando';

  if (items.length === 0) return null;

  return (
    <section aria-label="Prendas de la colección" className="relative">
      {/* El anillo. Al abrir una tarjeta se expande hacia afuera y se apaga:
          así "se separan" las demás. */}
      <div
        ref={anillo}
        className="relative h-[clamp(480px,72vh,760px)] w-full"
        style={{
          transition: menosMovimiento
            ? 'none'
            : `transform ${DURACION}ms ${CURVA}, opacity ${DURACION}ms ${CURVA}, filter ${DURACION}ms ${CURVA}`,
          transform: separado ? 'scale(1.16)' : 'none',
          opacity: separado ? 0 : 1,
          filter: separado && !menosMovimiento ? 'blur(6px)' : 'none',
          pointerEvents: apertura ? 'none' : 'auto',
        }}
      >
        <CircularCarousel
          items={items}
          preset="cylinder"
          intro="rise"
          cardWidth={320}
          aspectRatio={ASPECTO}
          gap={48}
          curve={0}
          tilt={0}
          perspective={3200}
          autoplay="drift"
          speed={14}
          interval={3}
          direction="left"
          momentum={0}
          snap
          pauseOnHover
          focusOnClick
          draggable
          parallax={1}
          stretch={1}
          // El desvanecimiento tiene que ir hacia el color del fondo: con el
          // negro por defecto, las tarjetas lejanas se ensuciarían sobre el crema.
          fadeColor="var(--season-fondo)"
          depthFade={0.55}
          innerShade={0.5}
          cornerRadius={0}
          captions
          onItemClick={abrir}
        />
      </div>

      {apertura && caja && producto && totalFotos > 0 && (
        <div
          ref={dialogo}
          role="dialog"
          aria-modal="true"
          aria-label={producto.nombre}
          tabIndex={-1}
          className="fixed inset-0 z-[80] cursor-zoom-out focus:outline-none"
          onClick={cerrar}
        >
          {/* Velo del color de la temporada: la tarjeta queda sola en su campo
              en vez de flotar sobre el título y el texto de la página. */}
          <div
            ref={velo}
            aria-hidden="true"
            className="absolute inset-0 bg-[var(--season-fondo)] opacity-0"
          />

          <div
            ref={tarjeta}
            className="absolute overflow-hidden"
            style={{
              left: caja.x,
              top: caja.y,
              width: caja.w,
              height: caja.h,
              transformOrigin: '0 0',
              willChange: 'transform',
            }}
          >
            <SlideFotos
              fotos={fotos}
              indice={foto}
              onCambiar={setFoto}
              // Al cerrar vuelve a la principal sin animar: si se deslizara
              // mientras la tarjeta vuela, se verían dos movimientos a la vez.
              conMovimiento={!menosMovimiento && apertura.fase !== 'cerrando'}
            />
          </div>

          {/* La ficha aparece cuando la tarjeta ya llegó. */}
          <div
            className="absolute left-1/2 w-[min(86vw,520px)] -translate-x-1/2 text-center transition-opacity duration-300"
            style={{
              top: caja.y + caja.h + 20,
              opacity: abiertoDelTodo ? 1 : 0,
            }}
          >
            <p
              className="text-3xl leading-none"
              style={{ fontFamily: 'var(--season-fuente-titulo)' }}
            >
              {producto.nombre}
            </p>
            <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-sm">
              <span className="tabular-nums">
                {producto.precio > 0 ? precioCOP(producto.precio) : 'Precio por definir'}
              </span>
              <span
                className="text-[11px] uppercase tracking-[0.16em]"
                style={{
                  color: escasezCritica(producto)
                    ? 'var(--season-acento)'
                    : 'var(--season-neutro)',
                }}
              >
                {textoExistencias(producto)}
              </span>
            </p>
            <Link
              href={`/colecciones/${producto.coleccion}/${producto.slug}`}
              // El resto del diálogo cierra al hacer clic; el enlace no.
              onClick={(e) => e.stopPropagation()}
              tabIndex={abiertoDelTodo ? 0 : -1}
              className="mt-4 inline-block cursor-pointer border-b border-current pb-0.5 text-xs uppercase tracking-[0.16em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--season-fondo)]"
            >
              Ver prenda
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
