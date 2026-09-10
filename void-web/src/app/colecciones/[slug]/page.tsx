import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TarjetaProducto from '@/components/coleccion/TarjetaProducto';
import { obtenerColeccion } from '@/data/colecciones';
import { stockTotal } from '@/data/tipos';

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

  const unidades = coleccion.productos.reduce((n, p) => n + stockTotal(p), 0);
  const { chakra } = coleccion;

  const datos = [
    ['Colección', `${String(coleccion.numero).padStart(2, '0')} de 07`],
    ['Elemento', chakra.elemento],
    ['Mantra', chakra.mantra],
    ['Bloqueo', chakra.emocionBloqueo],
    ['Virtud', chakra.virtud],
    ['Unidades', String(unidades)],
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32">
      <header className="border-b border-[color-mix(in_srgb,var(--season-tinta)_18%,transparent)] pb-14">
        <h1
          className="text-6xl leading-[0.9] tracking-wide text-balance md:text-8xl"
          style={{ fontFamily: 'var(--season-fuente-titulo)' }}
        >
          {coleccion.nombre}
        </h1>

        <p className="mt-10 max-w-[62ch] text-lg leading-relaxed text-[var(--season-neutro)]">
          {coleccion.manifiesto}
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {datos.map(([etiqueta, valor]) => (
            <div key={etiqueta}>
              <dt className="text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)]">
                {etiqueta}
              </dt>
              <dd className="mt-1 text-lg tabular-nums">{valor}</dd>
            </div>
          ))}
        </dl>
      </header>

      <ul className="grid grid-cols-1 gap-x-8 gap-y-14 pt-14 sm:grid-cols-2 lg:grid-cols-3">
        {coleccion.productos.map((producto, i) => (
          <li key={producto.slug}>
            <TarjetaProducto producto={producto} prioridad={i < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}
