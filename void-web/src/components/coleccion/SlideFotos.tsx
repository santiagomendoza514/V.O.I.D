'use client';

import { useRef } from 'react';
import type { Imagen } from '@/data/tipos';

const UMBRAL_DESLIZ = 40; // px horizontales para que cuente como pasar de foto

/**
 * Las fotos de una prenda, una tras otra. Solo aparece con la tarjeta abierta:
 * en el anillo cada prenda muestra únicamente su foto principal.
 *
 * Deslizar sobre la foto cambia de foto; tocarla sin deslizar cierra la tarjeta,
 * como pide el comportamiento del Flex Carousel. Por eso el clic que termina un
 * desliz se intercepta antes de que llegue al diálogo.
 */
export default function SlideFotos({
  fotos,
  indice,
  onCambiar,
  conMovimiento,
}: {
  fotos: Imagen[];
  indice: number;
  onCambiar: (indice: number) => void;
  conMovimiento: boolean;
}) {
  const inicio = useRef<{ x: number; y: number } | null>(null);
  const deslizo = useRef(false);
  const total = fotos.length;

  const ir = (i: number) => onCambiar((i + total) % total);

  const boton =
    'absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center bg-[var(--season-fondo)]/80 text-[var(--season-tinta)] backdrop-blur-sm transition-opacity hover:bg-[var(--season-fondo)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]';

  return (
    <div
      className="relative h-full w-full touch-pan-y select-none overflow-hidden"
      onPointerDown={(e) => {
        inicio.current = { x: e.clientX, y: e.clientY };
        deslizo.current = false;
      }}
      onPointerUp={(e) => {
        const desde = inicio.current;
        inicio.current = null;
        if (!desde || total < 2) return;
        const dx = e.clientX - desde.x;
        const dy = e.clientY - desde.y;
        if (Math.abs(dx) > UMBRAL_DESLIZ && Math.abs(dx) > Math.abs(dy)) {
          deslizo.current = true;
          ir(indice + (dx < 0 ? 1 : -1));
        }
      }}
      onClickCapture={(e) => {
        if (deslizo.current) {
          e.stopPropagation();
          deslizo.current = false;
        }
      }}
    >
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${indice * 100}%)`,
          transition: conMovimiento ? 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
      >
        {fotos.map((foto, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- mismos archivos
          // que ya cargó el anillo; salen de caché y no hay salto al abrir.
          <img
            key={`${foto.src}-${i}`}
            src={foto.src}
            alt={foto.alt}
            aria-hidden={i !== indice}
            draggable={false}
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            className={`${boton} left-3`}
            onClick={(e) => {
              e.stopPropagation();
              ir(indice - 1);
            }}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            className={`${boton} right-3`}
            onClick={(e) => {
              e.stopPropagation();
              ir(indice + 1);
            }}
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
            {fotos.map((foto, i) => (
              <button
                key={`punto-${foto.src}-${i}`}
                type="button"
                aria-label={`Ver foto ${i + 1} de ${total}`}
                aria-current={i === indice}
                onClick={(e) => {
                  e.stopPropagation();
                  ir(i);
                }}
                className="h-1.5 w-6 bg-[var(--season-fondo)] transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]"
                style={{ opacity: i === indice ? 1 : 0.45 }}
              />
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            Foto {indice + 1} de {total}
          </p>
        </>
      )}
    </div>
  );
}
