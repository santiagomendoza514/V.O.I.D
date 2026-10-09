'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * "Planta la semilla": el paso previo a crear la cuenta.
 *
 * Mūlādhāra es tierra, y Bīja —una de las prendas— significa semilla. Se
 * arrastra la semilla hasta el hueco, se suelta, cae; si acertó, germina.
 *
 * Esto NO es la protección contra bots. Un bot puede registrarse llamando
 * directo a Supabase sin pasar nunca por esta página. La protección real es
 * Cloudflare Turnstile, que Supabase verifica en el servidor. Esto es el
 * momento de marca que ve la persona.
 *
 * Una sola dimensión a propósito: arrastrar de lado funciona igual con dedo
 * que con mouse, y se traduce limpio a teclado (flechas y Enter).
 */

type Fase = 'lista' | 'arrastrando' | 'cayendo' | 'fallo' | 'plantada';

const INICIO = 0.08;          // posición inicial de la semilla, fracción del ancho
const MIN = 0.05;
const MAX = 0.95;
const TOLERANCIA_PX = 20;     // qué tan cerca del hueco cuenta como acierto
const PASO_TECLADO = 0.04;
const CAIDA_MS = 380;
const ALTO_CAIDA = 58;        // px desde donde cuelga hasta la superficie

export default function PlantaSemilla({ onPlantada }: { onPlantada: () => void }) {
  const pista = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);
  const [x, setX] = useState(INICIO);
  // null hasta montar: si el hueco se sorteara en el render, el servidor y el
  // navegador lo pondrían en sitios distintos y se rompería la hidratación.
  const [hueco, setHueco] = useState<number | null>(null);
  const [fase, setFase] = useState<Fase>('lista');
  const [menosMovimiento, setMenosMovimiento] = useState(false);
  const [aviso, setAviso] = useState('');
  const [fallido, setFallido] = useState(false);

  useEffect(() => {
    setHueco(0.42 + Math.random() * 0.44);
    setMenosMovimiento(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () => setAncho(el.getBoundingClientRect().width);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sobreElHueco = (pos: number) =>
    hueco !== null && Math.abs(pos - hueco) * ancho <= TOLERANCIA_PX;

  const soltar = useCallback(() => {
    if (fase === 'cayendo' || fase === 'plantada' || hueco === null) return;
    const acierto = Math.abs(x - hueco) * ancho <= TOLERANCIA_PX;
    if (acierto) setX(hueco); // se centra en el hueco para que caiga limpia
    setFase('cayendo');

    window.setTimeout(
      () => {
        if (acierto) {
          setFase('plantada');
          setAviso('Plantada. Ya puedes crear tu cuenta.');
          onPlantada();
        } else {
          setFase('fallo');
          setFallido(true);
          setAviso('Casi. Suéltala justo sobre el hueco.');
          window.setTimeout(
            () => {
              setX(INICIO);
              setFase('lista');
            },
            menosMovimiento ? 0 : 520
          );
        }
      },
      menosMovimiento ? 0 : CAIDA_MS
    );
  }, [fase, hueco, x, ancho, onPlantada, menosMovimiento]);

  const posicionDesdePuntero = (clientX: number) => {
    const caja = pista.current?.getBoundingClientRect();
    if (!caja) return x;
    return Math.min(MAX, Math.max(MIN, (clientX - caja.left) / caja.width));
  };

  const bloqueada = fase === 'cayendo' || fase === 'plantada';

  // Desplazamiento vertical de la semilla según la fase.
  const caida =
    fase === 'plantada' ? ALTO_CAIDA + 12 : fase === 'cayendo' || fase === 'fallo' ? ALTO_CAIDA : 0;
  const transicion = menosMovimiento
    ? 'none'
    : fase === 'arrastrando'
      ? 'none'
      : fase === 'cayendo'
        ? `transform ${CAIDA_MS}ms cubic-bezier(0.55, 0, 1, 0.45), left 200ms ease-out`
        : fase === 'plantada'
          ? 'transform 320ms ease-in, opacity 320ms ease-in'
          : 'transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1), left 420ms cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div className="border border-[var(--void-linea-fuerte)] bg-[var(--void-superficie)]">
      <div className="flex items-baseline justify-between gap-4 px-4 pt-3">
        <p className="text-sm">
          {fase === 'plantada' ? 'Ya germinó' : 'Planta la semilla'}
        </p>
        <p className="text-xs text-[var(--void-tinta-dim)]">
          {fase === 'plantada' ? 'Del vacío se crea todo' : 'Arrástrala al hueco y suéltala'}
        </p>
      </div>

      <div ref={pista} className="relative h-[124px] select-none overflow-hidden">
        {/* Tierra */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-9 border-t"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--void-acento) 42%, black), color-mix(in srgb, var(--void-acento) 22%, black))',
            borderColor: 'color-mix(in srgb, var(--void-acento) 70%, transparent)',
          }}
        />

        {/* El hueco */}
        {hueco !== null && (
          <div
            aria-hidden="true"
            className="absolute bottom-[30px] -translate-x-1/2"
            style={{ left: `${hueco * 100}%` }}
          >
            {fase !== 'plantada' && !menosMovimiento && (
              <span className="absolute left-1/2 top-1/2 h-7 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-[50%] border border-[var(--void-acento)] opacity-40" />
            )}
            <span className="block h-3 w-10 rounded-[50%] bg-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]" />
          </div>
        )}

        {/* El brote */}
        {hueco !== null && (
          <svg
            aria-hidden="true"
            viewBox="0 0 40 52"
            className="absolute bottom-[34px] h-[52px] w-10 -translate-x-1/2 origin-bottom"
            style={{
              left: `${hueco * 100}%`,
              transform: `translateX(-50%) scaleY(${fase === 'plantada' ? 1 : 0})`,
              transition: menosMovimiento ? 'none' : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 260ms',
            }}
          >
            <g
              fill="none"
              stroke="color-mix(in srgb, var(--void-exito) 65%, white)"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M20 52 C20 40 21 30 20 18" />
              <path d="M20 30 C14 28 9 22 8 15 C15 15 19 21 20 28" fill="color-mix(in srgb, var(--void-exito) 55%, white)" />
              <path d="M20 22 C26 20 31 14 32 7 C25 7 21 13 20 20" fill="color-mix(in srgb, var(--void-exito) 55%, white)" />
            </g>
          </svg>
        )}

        {/* La semilla */}
        <button
          type="button" // dentro de un formulario, un botón sin tipo lo enviaría
          disabled={bloqueada}
          aria-label="Semilla. Muévela con las flechas y pulsa Enter para soltarla."
          className="absolute top-3 grid h-12 w-12 -translate-x-1/2 touch-none place-items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)] disabled:cursor-default"
          style={{
            left: `${x * 100}%`,
            transform: `translateX(-50%) translateY(${caida}px)${fase === 'plantada' ? ' scale(0.5)' : ''}`,
            opacity: fase === 'plantada' ? 0 : 1,
            transition: transicion,
            cursor: fase === 'arrastrando' ? 'grabbing' : 'grab',
          }}
          onPointerDown={(e) => {
            if (bloqueada) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFase('arrastrando');
            setAviso('');
            setFallido(false);
          }}
          onPointerMove={(e) => {
            if (fase !== 'arrastrando') return;
            setX(posicionDesdePuntero(e.clientX));
          }}
          onPointerUp={() => {
            if (fase === 'arrastrando') soltar();
          }}
          onPointerCancel={() => fase === 'arrastrando' && setFase('lista')}
          onKeyDown={(e) => {
            if (bloqueada) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
              e.preventDefault();
              const paso = (e.key === 'ArrowRight' ? 1 : -1) * PASO_TECLADO * (e.shiftKey ? 3 : 1);
              const nueva = Math.min(MAX, Math.max(MIN, x + paso));
              setX(nueva);
              setAviso(sobreElHueco(nueva) ? 'La semilla está sobre el hueco. Pulsa Enter para soltarla.' : '');
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              soltar();
            }
          }}
        >
          <svg viewBox="0 0 22 30" className="h-[30px] w-[22px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
            <path
              d="M11 1 C17 7 20 14 19 20 C18 26 14 29 11 29 C8 29 4 26 3 20 C2 14 5 7 11 1 Z"
              fill="var(--void-tinta)"
            />
            <path d="M11 5 C11 12 11 20 11 26" stroke="var(--void-acento)" strokeWidth="1.2" fill="none" />
          </svg>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {aviso}
      </p>
      {fallido && fase !== 'plantada' && (
        <p aria-hidden="true" className="px-4 pb-3 text-xs text-[var(--void-tinta-dim)]">
          Casi. Suéltala justo sobre el hueco.
        </p>
      )}
    </div>
  );
}
