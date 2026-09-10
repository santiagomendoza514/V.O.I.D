import Link from 'next/link';
import type { Producto } from '@/data/tipos';
import { descriptorPrenda, escasezCritica, precioCOP, textoExistencias } from '@/lib/formato';
import MarcoPrenda from './MarcoPrenda';

export default function TarjetaProducto({
  producto,
  prioridad = false,
}: {
  producto: Producto;
  prioridad?: boolean;
}) {
  const escaso = escasezCritica(producto);

  return (
    <Link
      href={`/colecciones/${producto.coleccion}/${producto.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--season-acento)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--season-fondo)]"
    >
      <MarcoPrenda producto={producto} prioridad={prioridad} />

      <div className="flex items-baseline justify-between gap-4 pt-4">
        <h3
          className="text-2xl leading-none"
          style={{ fontFamily: 'var(--season-fuente-titulo)' }}
        >
          {producto.nombre}
        </h3>
        <span className="shrink-0 text-sm tabular-nums">
          {producto.precio > 0 ? precioCOP(producto.precio) : 'Precio por definir'}
        </span>
      </div>

      <p className="pt-1 text-sm text-[var(--season-neutro)]">
        {descriptorPrenda(producto)}
      </p>

      <p
        className="pt-2 text-xs uppercase tracking-[0.16em]"
        style={{ color: escaso ? 'var(--season-acento)' : 'var(--season-neutro)' }}
      >
        {textoExistencias(producto)}
      </p>
    </Link>
  );
}
