import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Producto } from '@/data/tipos';
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from './config';

/**
 * Existencias reales, leídas de la tabla `inventario`.
 *
 * El catálogo (nombres, precios, fotos) vive en el código; las existencias
 * viven en Supabase, porque bajan cuando alguien compra.
 *
 * Usa un cliente sin cookies a propósito: el inventario es público y no
 * necesita sesión, y leer cookies volvería dinámica la página entera, que hoy
 * se pre-renderiza y carga al instante.
 *
 * Devuelve null si Supabase no está configurado o no responde. En ese caso el
 * sitio usa las existencias escritas en el catálogo: mejor una cifra de
 * referencia que una página caída.
 */
export async function existenciasEnVivo(): Promise<Map<string, number> | null> {
  if (!supabaseConfigurado) return null;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase.from('inventario').select('sku, stock');
    if (error || !data) return null;
    return new Map(data.map((fila) => [fila.sku as string, fila.stock as number]));
  } catch {
    return null;
  }
}

/** Reemplaza el stock de referencia por el real, variante por variante. */
export function conExistencias(
  productos: Producto[],
  existencias: Map<string, number> | null
): Producto[] {
  if (!existencias) return productos;
  return productos.map((p) => ({
    ...p,
    variantes: p.variantes.map((v) =>
      existencias.has(v.sku) ? { ...v, stock: existencias.get(v.sku)! } : v
    ),
  }));
}
