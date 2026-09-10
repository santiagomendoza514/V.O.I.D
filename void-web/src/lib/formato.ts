import type { Producto } from '@/data/tipos';
import { stockTotal } from '@/data/tipos';

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** 90000 → "$ 90.000". Los precios de la marca no llevan centavos. */
export function precioCOP(valor: number): string {
  return pesos.format(valor).replace(/\s/g, ' ');
}

/**
 * Cómo se le habla al visitante de las existencias.
 *
 * Las colecciones son cápsulas de treinta y pico unidades: la escasez es la
 * ventaja narrativa de la marca, no algo que esconder. Por eso el texto se
 * vuelve más específico mientras menos queda.
 */
export function textoExistencias(producto: Producto): string {
  const total = stockTotal(producto);

  if (total === 0) return 'Agotado';
  if (producto.piezaUnica) return 'Pieza única';
  if (total === 1) return 'Queda 1';
  if (total <= 3) return `Quedan ${total}`;
  return `${total} disponibles`;
}

/** `true` cuando conviene destacar visualmente lo que queda. */
export function escasezCritica(producto: Producto): boolean {
  const total = stockTotal(producto);
  return total > 0 && (producto.piezaUnica || total <= 3);
}

/** "Sudadera en burda" — el tipo y el material, que es como se identifican. */
export function descriptorPrenda(producto: Producto): string {
  const tipos: Record<Producto['tipo'], string> = {
    chaqueta: 'Chaqueta',
    sudadera: 'Sudadera',
    camiseta: 'Camiseta',
    saco: 'Saco',
    hoodie: 'Hoodie',
    pantalon: 'Pantalón',
    tote: 'Tote bag',
  };
  return `${tipos[producto.tipo]} en ${producto.material.toLowerCase()}`;
}

/** Colores distintos de un producto, sin repetir, en orden de aparición. */
export function coloresDe(producto: Producto) {
  const vistos = new Map<string, { nombre: string; hex: string }>();
  for (const v of producto.variantes) {
    if (!vistos.has(v.color.hex)) vistos.set(v.color.hex, v.color);
  }
  return [...vistos.values()];
}
