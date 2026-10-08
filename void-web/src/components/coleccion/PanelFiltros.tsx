'use client';

import { useEffect, useId, useRef } from 'react';
import type { Talla, TipoPrenda } from '@/data/tipos';
import {
  ETIQUETA_CLIMA,
  ETIQUETA_TALLA,
  ETIQUETA_TIPO,
  FILTROS_VACIOS,
  type Clima,
  type Filtros,
  type Opciones,
} from '@/lib/filtros';
import { precioCOP } from '@/lib/formato';

const PASO_PRECIO = 5000;

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

function Opcion({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className="border px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--season-fondo)]"
      style={{
        borderColor: activa
          ? 'var(--season-tinta)'
          : 'color-mix(in srgb, var(--season-tinta) 22%, transparent)',
        backgroundColor: activa ? 'var(--season-tinta)' : 'transparent',
        color: activa ? 'var(--season-fondo)' : 'var(--season-tinta)',
      }}
    >
      {children}
    </button>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-[color-mix(in_srgb,var(--season-tinta)_14%,transparent)] py-6">
      <h3 className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)]">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

/**
 * Menú lateral de filtros. Filtra en vivo: el carrusel cambia detrás mientras
 * se eligen opciones, y el botón inferior dice cuántas prendas quedan antes de
 * cerrar. Así nunca se llega a un carrusel vacío por sorpresa.
 */
export default function PanelFiltros({
  abierto,
  onCerrar,
  filtros,
  onCambiar,
  opciones,
  resultados,
}: {
  abierto: boolean;
  onCerrar: () => void;
  filtros: Filtros;
  onCambiar: (f: Filtros) => void;
  opciones: Opciones;
  resultados: number;
}) {
  const panel = useRef<HTMLElement>(null);
  const tituloId = useId();

  // Escape cierra, el foco entra al panel, y la página no se desplaza detrás.
  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    const desbordeAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onTecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', onTecla);

    return () => {
      window.removeEventListener('keydown', onTecla);
      document.body.style.overflow = desbordeAnterior;
      anterior?.focus();
    };
  }, [abierto, onCerrar]);

  const cambiar = (parcial: Partial<Filtros>) => onCambiar({ ...filtros, ...parcial });

  const min = filtros.precioMin ?? opciones.precioMin;
  const max = filtros.precioMax ?? opciones.precioMax;
  // En los extremos, el filtro de precio se apaga. Así "todo el rango" incluye
  // también las prendas que todavía no tienen precio.
  const fijarMin = (v: number) =>
    cambiar({ precioMin: Math.min(v, max) <= opciones.precioMin ? null : Math.min(v, max) });
  const fijarMax = (v: number) =>
    cambiar({ precioMax: Math.max(v, min) >= opciones.precioMax ? null : Math.max(v, min) });

  const rango = 'w-full accent-[var(--season-dominante)]';

  return (
    <div
      className="fixed inset-0 z-[90]"
      style={{ pointerEvents: abierto ? 'auto' : 'none' }}
      inert={!abierto}
    >
      <div
        aria-hidden="true"
        onClick={onCerrar}
        className="absolute inset-0 bg-[var(--season-tinta)] transition-opacity duration-300 motion-reduce:transition-none"
        style={{ opacity: abierto ? 0.32 : 0 }}
      />

      <aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-[min(420px,92vw)] flex-col bg-[var(--season-fondo)] text-[var(--season-tinta)] shadow-2xl transition-transform duration-300 ease-out focus:outline-none motion-reduce:transition-none"
        style={{ transform: abierto ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <header className="flex items-center justify-between px-6 pb-2 pt-6">
          <h2 id={tituloId} className="text-2xl" style={{ fontFamily: 'var(--season-fuente-titulo)' }}>
            Filtrar
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar filtros"
            className="grid h-10 w-10 place-items-center text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {opciones.precioMax > opciones.precioMin && (
            <Grupo titulo="Precio">
              <p className="mb-4 text-sm tabular-nums">
                {precioCOP(min)} a {precioCOP(max)}
              </p>
              <label className="block text-xs text-[var(--season-neutro)]">
                Desde
                <input
                  type="range"
                  min={opciones.precioMin}
                  max={opciones.precioMax}
                  step={PASO_PRECIO}
                  value={min}
                  onChange={(e) => fijarMin(Number(e.target.value))}
                  className={`${rango} mt-1`}
                />
              </label>
              <label className="mt-3 block text-xs text-[var(--season-neutro)]">
                Hasta
                <input
                  type="range"
                  min={opciones.precioMin}
                  max={opciones.precioMax}
                  step={PASO_PRECIO}
                  value={max}
                  onChange={(e) => fijarMax(Number(e.target.value))}
                  className={`${rango} mt-1`}
                />
              </label>
            </Grupo>
          )}

          {opciones.tallas.length > 0 && (
            <Grupo titulo="Talla">
              <div className="flex flex-wrap gap-2">
                {opciones.tallas.map((t: Talla) => (
                  <Opcion
                    key={t}
                    activa={filtros.tallas.includes(t)}
                    onClick={() => cambiar({ tallas: alternar(filtros.tallas, t) })}
                  >
                    {ETIQUETA_TALLA[t]}
                  </Opcion>
                ))}
              </div>
            </Grupo>
          )}

          {opciones.colores.length > 0 && (
            <Grupo titulo="Color">
              <div className="flex flex-wrap gap-2">
                {opciones.colores.map((c) => (
                  <Opcion
                    key={c.hex}
                    activa={filtros.colores.includes(c.hex)}
                    onClick={() => cambiar({ colores: alternar(filtros.colores, c.hex) })}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-3.5 border border-[color-mix(in_srgb,currentColor_30%,transparent)]"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.nombre}
                    </span>
                  </Opcion>
                ))}
              </div>
            </Grupo>
          )}

          <Grupo titulo="Categorías">
            {opciones.prendas.length > 0 && (
              <>
                <p className="mb-2 text-sm">Por prenda</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {opciones.prendas.map((t: TipoPrenda) => (
                    <Opcion
                      key={t}
                      activa={filtros.tipos.includes(t)}
                      onClick={() => cambiar({ tipos: alternar(filtros.tipos, t) })}
                    >
                      {ETIQUETA_TIPO[t]}
                    </Opcion>
                  ))}
                </div>
              </>
            )}

            {opciones.climas.length > 0 && (
              <>
                <p className="mb-2 text-sm">Por clima</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {opciones.climas.map((c: Clima) => (
                    <Opcion
                      key={c}
                      activa={filtros.climas.includes(c)}
                      onClick={() => cambiar({ climas: alternar(filtros.climas, c) })}
                    >
                      {ETIQUETA_CLIMA[c]}
                    </Opcion>
                  ))}
                </div>
              </>
            )}

            {opciones.accesorios.length > 0 && (
              <>
                <p className="mb-2 text-sm">Accesorios</p>
                <div className="flex flex-wrap gap-2">
                  {opciones.accesorios.map((t: TipoPrenda) => (
                    <Opcion
                      key={t}
                      activa={filtros.tipos.includes(t)}
                      onClick={() => cambiar({ tipos: alternar(filtros.tipos, t) })}
                    >
                      {ETIQUETA_TIPO[t]}
                    </Opcion>
                  ))}
                </div>
              </>
            )}
          </Grupo>
        </div>

        <footer className="flex items-center gap-4 border-t border-[color-mix(in_srgb,var(--season-tinta)_14%,transparent)] px-6 py-5">
          <button
            type="button"
            onClick={() => onCambiar(FILTROS_VACIOS)}
            className="text-xs uppercase tracking-[0.16em] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 bg-[var(--season-dominante)] px-5 py-3 text-xs uppercase tracking-[0.16em] text-[var(--season-fondo)] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--season-fondo)]"
          >
            {resultados === 0
              ? 'Ninguna prenda coincide'
              : `Ver ${resultados} ${resultados === 1 ? 'prenda' : 'prendas'}`}
          </button>
        </footer>
      </aside>
    </div>
  );
}
