import { notFound } from 'next/navigation';
import { obtenerColeccion, slugsDeColecciones } from '@/data/colecciones';

export function generateStaticParams() {
  return slugsDeColecciones().map((slug) => ({ slug }));
}

/**
 * Aquí se aplica la piel de temporada. El atributo data-coleccion activa el
 * bloque de tokens --season-* correspondiente, y con eso cambian paleta y
 * tipografía de títulos sin que ningún componente sepa de qué colección se
 * trata. Es lo que permite que lanzar la temporada 05 sea escribir un bloque
 * de CSS y subir fotos.
 */
export default async function LayoutColeccion({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!obtenerColeccion(slug)) notFound();

  return (
    <div
      data-coleccion={slug}
      className="bg-[var(--season-fondo)] text-[var(--season-tinta)]"
    >
      {children}
    </div>
  );
}
