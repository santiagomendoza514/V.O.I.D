'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Producto } from '@/data/tipos';
import {
  FILTROS_VACIOS,
  aplicarFiltros,
  contarActivos,
  filtrosAURL,
  filtrosDesdeURL,
  opcionesDe,
  type Filtros,
} from '@/lib/filtros';
import CarruselColeccion from './CarruselColeccion';
import PanelFiltros from './PanelFiltros';

/**
 * El stock de la colección con su filtro. Sin parámetros en la URL muestra
 * todas las prendas; los filtros solo restan.
 *
 * La URL es la única fuente de verdad. Por eso un enlace del menú como
 * ?clima=frio llega ya filtrado, y si se pulsa otro enlace estando ya en esta
 * página, los filtros cambian sin recargar.
 */
export default function ColeccionInteractiva({ productos }: { productos: Producto[] }) {
  const params = useSearchParams();
  const ruta = usePathname();
  const [panelAbierto, setPanelAbierto] = useState(false);

  const opciones = useMemo(() => opcionesDe(productos), [productos]);
  const filtros = useMemo(() => filtrosDesdeURL(params, opciones), [params, opciones]);
  const visibles = useMemo(() => aplicarFiltros(productos, filtros), [productos, filtros]);
  const activos = contarActivos(filtros);

  // replaceState en vez de router.replace: cambia la URL sin pedirle nada al
  // servidor. Next lo detecta y actualiza useSearchParams. Tampoco llena el
  // historial: el botón "atrás" sale de la colección, no deshace un filtro.
  const setFiltros = useCallback(
    (f: Filtros) => {
      const consulta = filtrosAURL(f, opciones);
      window.history.replaceState(null, '', consulta ? `${ruta}?${consulta}` : ruta);
    },
    [opciones, ruta]
  );

  const cerrarPanel = useCallback(() => setPanelAbierto(false), []);
  const limpiar = () => setFiltros(FILTROS_VACIOS);

  // El anillo se vuelve a montar cuando cambia la selección: las prendas nuevas
  // entran con la animación de entrada en vez de reacomodarse a saltos.
  const claveAnillo = visibles.map((p) => p.slug).join('|');

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 pb-8">
        <button
          type="button"
          onClick={() => setPanelAbierto(true)}
          aria-haspopup="dialog"
          aria-expanded={panelAbierto}
          className="border border-[var(--season-tinta)] px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-[var(--season-tinta)] hover:text-[var(--season-fondo)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--season-fondo)]"
        >
          Filtrar{activos > 0 && ` (${activos})`}
        </button>

        <p className="text-sm tabular-nums text-[var(--season-neutro)]" aria-live="polite">
          {visibles.length === productos.length
            ? `${productos.length} prendas`
            : `${visibles.length} de ${productos.length} prendas`}
        </p>

        {activos > 0 && (
          <button
            type="button"
            onClick={limpiar}
            className="text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {visibles.length > 0 ? (
        <CarruselColeccion key={claveAnillo} productos={visibles} />
      ) : (
        <div className="mx-auto flex h-[clamp(320px,50vh,520px)] max-w-6xl flex-col items-center justify-center px-6 text-center">
          <p className="text-lg">Ninguna prenda coincide con estos filtros.</p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-4 border-b border-current pb-0.5 text-xs uppercase tracking-[0.16em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <PanelFiltros
        abierto={panelAbierto}
        onCerrar={cerrarPanel}
        filtros={filtros}
        onCambiar={setFiltros}
        opciones={opciones}
        resultados={visibles.length}
      />
    </>
  );
}
