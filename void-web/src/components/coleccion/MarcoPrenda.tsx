import Image from 'next/image';
import type { Producto } from '@/data/tipos';
import { coloresDe } from '@/lib/formato';

/**
 * El marco de una prenda.
 *
 * Las fotos de la colección existen pero todavía no están seleccionadas, así que
 * mientras tanto el marco muestra los colores reales de la prenda en bandas. No
 * es un relleno: el color es dato verdadero del catálogo, y una banda por color
 * dice de un vistazo cuántos colorways tiene la prenda. Cuando lleguen las
 * fotos, se reemplaza solo.
 */
export default function MarcoPrenda({
  producto,
  prioridad = false,
}: {
  producto: Producto;
  prioridad?: boolean;
}) {
  const foto = producto.imagenes.find((i) => i.principal) ?? producto.imagenes[0];

  if (foto) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          priority={prioridad}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  const colores = coloresDe(producto);

  return (
    <div
      className="flex aspect-[3/4] overflow-hidden"
      role="img"
      aria-label={`${producto.nombre}: ${colores.map((c) => c.nombre).join(', ')}`}
    >
      {colores.map((color) => (
        <span
          key={color.hex}
          className="flex-1"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </div>
  );
}
