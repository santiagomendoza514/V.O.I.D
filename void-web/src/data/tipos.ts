/**
 * Tipos del catálogo de V.O.I.D.
 *
 * La marca son siete colecciones, una por chakra. Todo lo visual se parte en dos
 * capas: la cáscara (permanente, en `--void-*`) y la piel de temporada (por
 * colección, en `--season-*`). `TemaColeccion` es la piel; la cáscara vive en CSS
 * y no se modela aquí porque no cambia nunca.
 */

export type NumeroColeccion = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type EstadoColeccion = 'proxima' | 'activa' | 'archivada';

export type TipoPrenda =
  | 'chaqueta'
  | 'sudadera'
  | 'camiseta'
  | 'saco'
  | 'hoodie'
  | 'pantalon'
  | 'tote';

/** `U` es talla única: totes y piezas sin escalado. */
export type Talla = 'S' | 'M' | 'L' | 'U';

/** Dónde se lleva la prenda. Define los espacios del armador de outfits. */
export type SlotOutfit = 'torso' | 'piernas' | 'exterior' | 'accesorio';

/** Cómo se apila la prenda sobre el cuerpo. Lo usa la sugerencia por clima. */
export type CapaAbrigo = 'base' | 'media' | 'exterior' | 'accesorio';

export interface Chakra {
  elemento: string;
  mantra: string;
  /** La emoción que bloquea este centro. En Mūlādhāra, el miedo. */
  emocionBloqueo: string;
  virtud: string;
}

export interface TemaColeccion {
  colores: {
    fondo: string;
    tinta: string;
    dominante: string;
    dominanteAlt: string;
    secundario: string;
    terciario: string;
    acento: string;
    neutro: string;
  };
  fuenteTitulo: string;
}

export interface Imagen {
  src: string;
  alt: string;
  /** La primera imagen con `principal: true` es la de la tarjeta de catálogo. */
  principal?: boolean;
}

export interface Color {
  nombre: string;
  hex: string;
}

export interface Variante {
  /** VOID-MUL-SUD-BUR-VIN-M — marca, colección, tipo, material, color, talla. */
  sku: string;
  talla: Talla;
  color: Color;
  /**
   * Existencias reales. Se muestran en el sitio: las colecciones son cápsulas de
   * treinta y pico unidades y la escasez es la ventaja narrativa de la marca,
   * no algo que esconder.
   */
  stock: number;
}

/**
 * Condiciones para las que sirve la prenda. Alimenta la sugerencia de outfit del
 * día contra Open-Meteo.
 *
 * Se llena al catalogar aunque esa función se construya después: agregarla más
 * tarde obliga a revisar cada prenda a mano.
 */
export interface DatosClima {
  /** 1 camiseta, 5 chaqueta de invierno. */
  abrigo: 1 | 2 | 3 | 4 | 5;
  capa: CapaAbrigo;
  /** Rango de temperatura ideal en °C. */
  tempIdealMin: number;
  tempIdealMax: number;
  resisteLluvia: boolean;
  transpirable: boolean;
}

/**
 * Datos para el armador de outfits. Se construye en tres fases: primero 2D con
 * recortes, luego 360° fotográfico en plato giratorio, y solo entonces 3D real
 * si el negocio lo justifica. Por eso los tres campos de asset son opcionales.
 */
export interface DatosOutfit {
  slot: SlotOutfit;
  /** Hex del color que domina la prenda, para proponer combinaciones. */
  colorDominante: string;
  /** Slugs de productos que combinan bien con este. */
  combinaCon: string[];
  /** PNG sin fondo. */
  recorte2d?: string;
  vistas360?: string[];
  modelo3d?: string;
}

export interface Producto {
  slug: string;
  nombre: string;
  /** Slug de la colección a la que pertenece. */
  coleccion: string;
  tipo: TipoPrenda;
  material: string;
  descripcion: string;
  /** Pesos colombianos, enteros. */
  precio: number;
  /**
   * `true` mientras falte comprar tela e insumos. El sitio debe señalarlo o
   * retener la prenda de la venta: un precio que después cambia es una promesa
   * rota con un cliente real.
   */
  precioEstimado: boolean;
  piezaUnica: boolean;
  imagenes: Imagen[];
  variantes: Variante[];
  clima: DatosClima;
  outfit: DatosOutfit;
}

export interface Coleccion {
  slug: string;
  numero: NumeroColeccion;
  nombre: string;
  chakra: Chakra;
  estado: EstadoColeccion;
  manifiesto: string;
  tema: TemaColeccion;
  productos: Producto[];
}

/** Unidades disponibles de un producto, sumando todas sus variantes. */
export function stockTotal(producto: Producto): number {
  return producto.variantes.reduce((suma, v) => suma + v.stock, 0);
}

/** Un producto agotado sigue visible: la colección es su propio archivo. */
export function estaAgotado(producto: Producto): boolean {
  return stockTotal(producto) === 0;
}

/** Tallas con al menos una unidad, en orden de escalado. */
export function tallasDisponibles(producto: Producto): Talla[] {
  const orden: Talla[] = ['S', 'M', 'L', 'U'];
  const conStock = new Set(
    producto.variantes.filter((v) => v.stock > 0).map((v) => v.talla)
  );
  return orden.filter((t) => conStock.has(t));
}
