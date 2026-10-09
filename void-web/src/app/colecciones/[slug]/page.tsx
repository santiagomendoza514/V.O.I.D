import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ColeccionInteractiva from '@/components/coleccion/ColeccionInteractiva';
import { obtenerColeccion } from '@/data/colecciones';
import { stockTotal } from '@/data/tipos';
import { conExistencias, existenciasEnVivo } from '@/lib/supabase/existencias';

// La página se pre-renderiza, pero se regenera como mucho cada minuto para
// traer las existencias reales de Supabase. Así "queda 1" no queda congelado
// en lo que había el día del despliegue.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const coleccion = obtenerColeccion(slug);
  if (!coleccion) return {};

  return {
    title: `${coleccion.nombre} · V.O.I.D`,
    description: coleccion.manifiesto.slice(0, 155),
  };
}

export default async function PaginaColeccion({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coleccion = obtenerColeccion(slug);
  if (!coleccion) notFound();

  const productos = conExistencias(coleccion.productos, await existenciasEnVivo());
  const unidades = productos.reduce((n, p) => n + stockTotal(p), 0);
  const { chakra } = coleccion;

  const datos = [
    ['Colección', `${coleccion.numero} de VII`],
    ['Elemento', chakra.elemento],
    ['Mantra', chakra.mantra],
    ['Bloqueo', chakra.emocionBloqueo],
    ['Virtud', chakra.virtud],
    ['Unidades', String(unidades)],
  ];

  return (
    <div className="pb-20">
      <header className="mx-auto max-w-6xl px-6 pb-10">
        <span className="text-sm tabular-nums text-[var(--season-neutro)]">
          {coleccion.numero}
        </span>
        <h1
          className="mt-2 text-6xl leading-[0.9] tracking-wide text-balance md:text-8xl"
          style={{ fontFamily: 'var(--season-fuente-titulo)' }}
        >
          {coleccion.nombre}
        </h1>
       {/* <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-[var(--season-neutro)]">
          {coleccion.manifiesto}
        </p>*/}
      </header>

      {/* Los filtros se leen de la URL, que solo existe en el navegador. Sin
          esta frontera, Next dejaría de pre-renderizar la página entera. El
          hueco tiene el alto del carrusel para que nada salte al cargar. */}
      <Suspense fallback={<div className="h-[calc(clamp(480px,72vh,760px)+4.5rem)]" />}>
        <ColeccionInteractiva productos={productos} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[color-mix(in_srgb,var(--season-tinta)_18%,transparent)] pt-10 sm:grid-cols-3 lg:grid-cols-6">
          {/*{datos.map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt className="text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)]">
                {etiqueta}
              </dt>
              <dd className="mt-1 text-lg tabular-nums">{valor}</dd>
            </div>
          ))}*/}
        </dl>
      </div>
    </div>
  );
}
