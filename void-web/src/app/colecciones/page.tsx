import type { Metadata } from 'next';
import Link from 'next/link';
import { recorrido } from '@/data/colecciones';

export const metadata: Metadata = {
  title: 'Colecciones · V.O.I.D',
  description: 'Siete colecciones, una por cada centro energético. Mūlādhāra es la primera.',
};

export default function PaginaColecciones() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-32">
      <header className="border-b border-[var(--void-linea-fuerte)] pb-12">
        <h1 className="max-w-[16ch] text-5xl leading-[0.95] tracking-wide text-balance md:text-7xl">
          El ascenso
        </h1>
        <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-[var(--void-tinta-dim)]">
          Siete colecciones, una por cada centro energético del cuerpo. Cada una trabaja la
          emoción que bloquea ese centro. Empezamos abajo, en la raíz, con el miedo.
        </p>
      </header>

      {/* La numeración es real: los chakras ascienden en un orden fijo. */}
      <ol>
        {recorrido.map((coleccion) => {
          const activa = 'productos' in coleccion;
          const fila = (
            <>
              <span className="w-12 shrink-0 pt-2 text-sm tabular-nums text-[var(--void-tinta-dim)]">
                {String(coleccion.numero).padStart(2, '0')}
              </span>

              <span className="flex-1">
                <span className="block text-3xl leading-tight md:text-4xl">
                  {coleccion.nombre}
                </span>
                <span className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs uppercase tracking-[0.16em] text-[var(--void-tinta-dim)]">
                  <span>{coleccion.chakra.elemento}</span>
                  <span>{coleccion.chakra.mantra}</span>
                  <span>Contra el {coleccion.chakra.emocionBloqueo.toLowerCase()}</span>
                </span>
              </span>

              <span className="shrink-0 self-center text-xs uppercase tracking-[0.16em] text-[var(--void-tinta-dim)]">
                {activa ? 'Ver colección' : 'Próxima'}
              </span>
            </>
          );

          return (
            <li key={coleccion.slug} className="border-b border-[var(--void-linea)]">
              {activa ? (
                <Link
                  href={`/colecciones/${coleccion.slug}`}
                  className="flex gap-6 py-10 transition-colors hover:text-[var(--void-acento)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
                >
                  {fila}
                </Link>
              ) : (
                <div className="flex gap-6 py-10 text-[var(--void-tinta-dim)]">{fila}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
