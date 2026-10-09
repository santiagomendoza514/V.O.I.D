import type { TipoPrenda } from '@/data/tipos';
import type { Clima } from './filtros';

/**
 * Destinos de los enlaces del sitio, en un solo lugar.
 *
 * Vive aparte del catálogo a propósito: los menús están en el encabezado de
 * todas las páginas, e importar aquí `muladhara.ts` metería las once prendas en
 * cada visita.
 */

/**
 * La colección que está a la venta. Cuando se lance Svādhiṣṭhāna, se cambia
 * aquí y todos los enlaces de "comprar" del sitio pasan a apuntar a ella.
 */
export const COLECCION_ACTIVA = 'muladhara';

export const RUTAS = {
  inicio: '/',
  colecciones: '/colecciones',
  coleccionActiva: `/colecciones/${COLECCION_ACTIVA}`,
  entrar: '/entrar',
  registro: '/entrar?modo=registro',
  cuenta: '/cuenta',
} as const;

/** Qué tipos de prenda caen en cada parte del cuerpo. */
export const PARTES = {
  tops: ['chaqueta', 'camiseta', 'saco', 'hoodie'],
  bottoms: ['pantalon', 'sudadera'],
  accesorios: ['tote'],
} as const satisfies Record<string, readonly TipoPrenda[]>;

/** /colecciones/muladhara?tipo=saco,hoodie&clima=frio */
export function enlaceColeccion(
  filtro: { tipo?: readonly TipoPrenda[]; clima?: readonly Clima[] } = {},
  slug: string = COLECCION_ACTIVA
): string {
  const partes: string[] = [];
  if (filtro.tipo?.length) partes.push(`tipo=${filtro.tipo.join(',')}`);
  if (filtro.clima?.length) partes.push(`clima=${filtro.clima.join(',')}`);
  return `/colecciones/${slug}${partes.length ? `?${partes.join('&')}` : ''}`;
}
