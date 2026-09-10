import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarcoPrenda from '@/components/coleccion/MarcoPrenda';
import { colecciones, obtenerColeccion, obtenerProducto } from '@/data/colecciones';
import { stockTotal } from '@/data/tipos';
import { descriptorPrenda, escasezCritica, precioCOP, textoExistencias } from '@/lib/formato';

export function generateStaticParams() {
  return colecciones.flatMap((c) =>
    c.productos.map((p) => ({ slug: c.slug, producto: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; producto: string }>;
}): Promise<Metadata> {
  const { slug, producto: slugProducto } = await params;
  const producto = obtenerProducto(slug, slugProducto);
  if (!producto) return {};

  return {
    title: `${producto.nombre} · V.O.I.D`,
    description: producto.descripcion.slice(0, 155),
  };
}

export default async function PaginaProducto({
  params,
}: {
  params: Promise<{ slug: string; producto: string }>;
}) {
  const { slug, producto: slugProducto } = await params;
  const coleccion = obtenerColeccion(slug);
  const producto = obtenerProducto(slug, slugProducto);
  if (!coleccion || !producto) notFound();

  const escaso = escasezCritica(producto);
  const agotado = stockTotal(producto) === 0;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32">
      <Link
        href={`/colecciones/${coleccion.slug}`}
        className="inline-block text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)] transition-colors hover:text-[var(--season-acento)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)]"
      >
        {coleccion.nombre}
      </Link>

      <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-2 lg:gap-20">
        <MarcoPrenda producto={producto} prioridad />

        <div className="lg:pt-6">
          <h1
            className="text-5xl leading-none tracking-wide md:text-6xl"
            style={{ fontFamily: 'var(--season-fuente-titulo)' }}
          >
            {producto.nombre}
          </h1>

          <p className="mt-3 text-[var(--season-neutro)]">{descriptorPrenda(producto)}</p>

          <p className="mt-8 text-2xl tabular-nums">
            {producto.precio > 0 ? precioCOP(producto.precio) : 'Precio por definir'}
          </p>
          {producto.precioEstimado && producto.precio > 0 && (
            <p className="mt-1 text-xs text-[var(--season-neutro)]">
              Precio estimado: falta confirmar el costo de la tela.
            </p>
          )}

          <p
            className="mt-6 text-xs uppercase tracking-[0.16em]"
            style={{ color: escaso ? 'var(--season-acento)' : 'var(--season-neutro)' }}
          >
            {textoExistencias(producto)}
          </p>

          <p className="mt-8 max-w-[52ch] leading-relaxed">{producto.descripcion}</p>

          <h2 className="mt-12 text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)]">
            {producto.variantes.length === 1 ? 'La pieza' : 'Las piezas'}
          </h2>

          {producto.variantes.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--season-neutro)]">
              Todavía no está definido cuántas se van a fabricar.
            </p>
          ) : (
            <ul className="mt-4 border-t border-[color-mix(in_srgb,var(--season-tinta)_18%,transparent)]">
              {producto.variantes.map((variante) => (
                <li
                  key={variante.sku}
                  className="flex items-center gap-4 border-b border-[color-mix(in_srgb,var(--season-tinta)_12%,transparent)] py-3"
                >
                  <span
                    className="h-6 w-6 shrink-0 border border-[color-mix(in_srgb,var(--season-tinta)_20%,transparent)]"
                    style={{ backgroundColor: variante.color.hex }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm">
                    {variante.color.nombre}
                    {variante.talla !== 'U' && ` · Talla ${variante.talla}`}
                  </span>
                  <span className="text-xs uppercase tracking-[0.16em] text-[var(--season-neutro)]">
                    {variante.stock === 0 ? 'Agotada' : `${variante.stock} disponible`}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/*
            Todavía no hay pasarela de pago conectada, así que no ponemos un
            botón de compra: un control que no hace nada es peor que decir la
            verdad. Se reemplaza cuando quede lista.
          */}
          <p className="mt-10 border border-[color-mix(in_srgb,var(--season-tinta)_20%,transparent)] p-5 text-sm leading-relaxed text-[var(--season-neutro)]">
            {agotado
              ? 'Esta pieza ya no está disponible. La colección queda como archivo.'
              : 'La venta en línea abre pronto. Mientras tanto puedes escribirnos para apartarla.'}
          </p>
        </div>
      </div>
    </div>
  );
}
