import type { Color, Producto, Talla, TipoPrenda } from '@/data/tipos';

/**
 * Filtrado del stock de una colección.
 *
 * Dentro de un mismo grupo los filtros se suman (talla M *o* L); entre grupos
 * se cruzan (talla M *y* color negro). Las opciones salen de los datos, así que
 * el panel nunca ofrece una talla o un color que no existe en la colección: la
 * temporada 02 tendrá sus propias opciones sin tocar este archivo.
 */

export type Clima = 'frio' | 'templado' | 'calido' | 'lluvia';

export interface Filtros {
  /** null = sin límite. */
  precioMin: number | null;
  precioMax: number | null;
  tallas: Talla[];
  /** Hex de los colores elegidos. */
  colores: string[];
  /** Prendas y accesorios van juntos: un artículo es una cosa o la otra. */
  tipos: TipoPrenda[];
  climas: Clima[];
}

export const FILTROS_VACIOS: Filtros = {
  precioMin: null,
  precioMax: null,
  tallas: [],
  colores: [],
  tipos: [],
  climas: [],
};

export const ETIQUETA_TIPO: Record<TipoPrenda, string> = {
  chaqueta: 'Chaquetas',
  sudadera: 'Sudaderas',
  camiseta: 'Camisetas',
  saco: 'Sacos',
  hoodie: 'Hoodies',
  pantalon: 'Pantalones',
  tote: 'Tote bags',
};

export const ETIQUETA_TALLA: Record<Talla, string> = {
  S: 'S',
  M: 'M',
  L: 'L',
  U: 'Única',
};

export const ETIQUETA_CLIMA: Record<Clima, string> = {
  frio: 'Frío',
  templado: 'Templado',
  calido: 'Cálido',
  lluvia: 'Lluvia',
};

const ORDEN_TALLA: Talla[] = ['S', 'M', 'L', 'U'];
const ORDEN_CLIMA: Clima[] = ['frio', 'templado', 'calido', 'lluvia'];

export function esAccesorio(p: Producto): boolean {
  return p.outfit.slot === 'accesorio';
}

/**
 * Para qué clima sirve una prenda. Sale del nivel de abrigo que se definió al
 * catalogar, no de la temperatura ideal: los rangos de temperatura se solapan
 * tanto que casi todo terminaría sirviendo para todo.
 *
 * Los accesorios no tienen clima: una tote bag no abriga.
 */
export function climasDe(p: Producto): Clima[] {
  if (esAccesorio(p)) return [];
  const climas: Clima[] = [];
  const { abrigo, resisteLluvia } = p.clima;
  if (abrigo >= 4) climas.push('frio');
  else if (abrigo >= 2) climas.push('templado');
  else climas.push('calido');
  if (resisteLluvia) climas.push('lluvia');
  return climas;
}

function hayVarianteQueCumple(p: Producto, f: Filtros): boolean {
  // Talla y color se evalúan sobre la MISMA variante. "M en negro" significa
  // que existe una M negra, no una M café y una S negra.
  return p.variantes.some(
    (v) =>
      v.stock > 0 &&
      (f.tallas.length === 0 || f.tallas.includes(v.talla)) &&
      (f.colores.length === 0 || f.colores.includes(v.color.hex))
  );
}

export function aplicarFiltros(productos: Producto[], f: Filtros): Producto[] {
  const filtraPrecio = f.precioMin !== null || f.precioMax !== null;
  const filtraVariante = f.tallas.length > 0 || f.colores.length > 0;

  return productos.filter((p) => {
    if (filtraPrecio) {
      // Una prenda sin precio todavía no se puede ubicar en ningún rango.
      if (p.precio <= 0) return false;
      if (f.precioMin !== null && p.precio < f.precioMin) return false;
      if (f.precioMax !== null && p.precio > f.precioMax) return false;
    }
    if (filtraVariante && !hayVarianteQueCumple(p, f)) return false;
    if (f.tipos.length > 0 && !f.tipos.includes(p.tipo)) return false;
    if (f.climas.length > 0 && !climasDe(p).some((c) => f.climas.includes(c))) return false;
    return true;
  });
}

/** Cuántos grupos de filtro están activos, para el botón "Filtrar (2)". */
export function contarActivos(f: Filtros): number {
  return (
    (f.precioMin !== null || f.precioMax !== null ? 1 : 0) +
    (f.tallas.length > 0 ? 1 : 0) +
    (f.colores.length > 0 ? 1 : 0) +
    (f.tipos.length > 0 ? 1 : 0) +
    (f.climas.length > 0 ? 1 : 0)
  );
}

export interface Opciones {
  precioMin: number;
  precioMax: number;
  tallas: Talla[];
  colores: Color[];
  prendas: TipoPrenda[];
  accesorios: TipoPrenda[];
  climas: Clima[];
}

/** Las opciones que existen de verdad en la colección. */
export function opcionesDe(productos: Producto[]): Opciones {
  const precios = productos.map((p) => p.precio).filter((n) => n > 0);
  const tallas = new Set<Talla>();
  const colores = new Map<string, Color>();
  const prendas = new Set<TipoPrenda>();
  const accesorios = new Set<TipoPrenda>();
  const climas = new Set<Clima>();

  for (const p of productos) {
    for (const v of p.variantes) {
      tallas.add(v.talla);
      if (!colores.has(v.color.hex)) colores.set(v.color.hex, v.color);
    }
    (esAccesorio(p) ? accesorios : prendas).add(p.tipo);
    climasDe(p).forEach((c) => climas.add(c));
  }

  return {
    precioMin: precios.length ? Math.min(...precios) : 0,
    precioMax: precios.length ? Math.max(...precios) : 0,
    tallas: ORDEN_TALLA.filter((t) => tallas.has(t)),
    colores: [...colores.values()],
    prendas: [...prendas],
    accesorios: [...accesorios],
    climas: ORDEN_CLIMA.filter((c) => climas.has(c)),
  };
}
