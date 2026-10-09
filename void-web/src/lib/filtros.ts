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

/* ---------- Filtros en la URL ---------- */

/**
 * Los filtros viven en la URL: /colecciones/muladhara?tipo=saco,hoodie&clima=frio
 *
 * Así un enlace del menú puede abrir la colección ya filtrada, recargar no los
 * borra, y una búsqueda se puede compartir. Lo que no se reconoce se ignora en
 * silencio: un enlace viejo nunca rompe la página.
 */

const TIPOS: TipoPrenda[] = ['chaqueta', 'sudadera', 'camiseta', 'saco', 'hoodie', 'pantalon', 'tote'];

/** "Café" → "cafe". Para nombres de color legibles en la URL. */
export function aSlug(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function lista(params: URLSearchParams, clave: string): string[] {
  return (params.get(clave) ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function filtrosDesdeURL(params: URLSearchParams, opciones: Opciones): Filtros {
  const [desde, hasta] = (params.get('precio') ?? '').split('-').map(Number);
  const valido = (n: number) => Number.isFinite(n) && n > 0;

  return {
    precioMin: valido(desde) && desde > opciones.precioMin ? desde : null,
    precioMax: valido(hasta) && hasta < opciones.precioMax ? hasta : null,
    tallas: lista(params, 'talla')
      .map((t) => (t.toUpperCase() === 'UNICA' ? 'U' : t.toUpperCase()))
      .filter((t): t is Talla => (ORDEN_TALLA as string[]).includes(t)),
    colores: lista(params, 'color')
      .map((nombre) => opciones.colores.find((c) => aSlug(c.nombre) === aSlug(nombre))?.hex)
      .filter((hex): hex is string => Boolean(hex)),
    tipos: lista(params, 'tipo').filter((t): t is TipoPrenda => (TIPOS as string[]).includes(t)),
    climas: lista(params, 'clima').filter((c): c is Clima => (ORDEN_CLIMA as string[]).includes(c)),
  };
}

export function filtrosAURL(f: Filtros, opciones: Opciones): string {
  const partes: string[] = [];
  const poner = (clave: string, valores: string[]) => {
    if (valores.length) partes.push(`${clave}=${valores.map(encodeURIComponent).join(',')}`);
  };
  poner('tipo', f.tipos);
  poner('clima', f.climas);
  poner('talla', f.tallas);
  poner(
    'color',
    f.colores
      .map((hex) => opciones.colores.find((c) => c.hex === hex)?.nombre)
      .filter((n): n is string => Boolean(n))
      .map(aSlug)
  );
  if (f.precioMin !== null || f.precioMax !== null) {
    partes.push(`precio=${f.precioMin ?? opciones.precioMin}-${f.precioMax ?? opciones.precioMax}`);
  }
  return partes.join('&');
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
