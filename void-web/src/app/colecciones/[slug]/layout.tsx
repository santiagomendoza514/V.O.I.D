import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { obtenerColeccion, slugsDeColecciones } from '@/data/colecciones';
import type { TemaColeccion } from '@/data/tipos';

export function generateStaticParams() {
  return slugsDeColecciones().map((slug) => ({ slug }));
}

/**
 * El `tema` de la colección convertido en las variables --season-* que usan
 * los componentes. Así la paleta tiene una sola fuente de verdad: el archivo
 * de datos de la colección. Cambiar un color ahí lo cambia en pantalla.
 *
 * El fondo no está aquí: es el mismo para todas las colecciones y vive en
 * tokens.css.
 */
function variablesDeTema({ colores, fuenteTitulo }: TemaColeccion): CSSProperties {
  return {
    '--season-tinta': colores.tinta,
    '--season-dominante': colores.dominante,
    '--season-dominante-alt': colores.dominanteAlt,
    '--season-secundario': colores.secundario,
    '--season-terciario': colores.terciario,
    '--season-acento': colores.acento,
    '--season-neutro': colores.neutro,
    '--season-fuente-titulo': `'${fuenteTitulo}', Georgia, serif`,
  } as CSSProperties;
}

export default async function LayoutColeccion({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coleccion = obtenerColeccion(slug);
  if (!coleccion) notFound();

  return (
    <div
      data-coleccion={slug}
      style={variablesDeTema(coleccion.tema)}
      className="bg-[var(--season-fondo)] pt-32 text-[var(--season-tinta)] md:pt-44"
    >
      {children}
    </div>
  );
}
