import type { Coleccion, Producto } from '../tipos';

/**
 * Mūlādhāra — colección 01 de 07. Chakra raíz, elemento tierra.
 *
 * 34 unidades. Los nombres vienen del campo semántico de la tierra (estratos,
 * geología, raíz) y no se cambian: viven en URLs, SKU y fotos.
 *
 * PENDIENTE — dos datos faltan y están marcados en su sitio:
 *  · Las fotos existen pero aún no están seleccionadas: `imagenes` va vacío.
 *  · Los colores de Bīja, Corteza y Cobijo son provisionales (ver nota abajo).
 */

const COLECCION = 'muladhara';

/** Colores de las prendas, tomados de la paleta de temporada. */
const COLORES = {
  negro: { nombre: 'Negro', hex: '#1A1614' },
  cafe: { nombre: 'Café', hex: '#4A3728' },
  vinotinto: { nombre: 'Vinotinto', hex: '#4A121F' },
  verde: { nombre: 'Verde', hex: '#5F6647' },
  crema: { nombre: 'Crema', hex: '#EDE4D3' },
  burdeos: { nombre: 'Burdeos', hex: '#6E1F2E' },
  terracota: { nombre: 'Terracota', hex: '#B5623C' },
  cabernet: { nombre: 'Cabernet', hex: '#2E0C16' },
} as const;

const productos: Producto[] = [
  {
    slug: 'kanda',
    nombre: 'Kanda',
    coleccion: COLECCION,
    tipo: 'chaqueta',
    material: 'Microfibra',
    descripcion:
      'En la anatomía yóguica, el kanda es el bulbo raíz del que nacen todos los nadis. Una sola chaqueta, en una sola talla. Cuando se vaya, no vuelve.',
    precio: 130000,
    precioEstimado: true,
    piezaUnica: true,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-CHA-MIC-NEG-M', talla: 'M', color: COLORES.negro, stock: 1 },
    ],
    clima: {
      abrigo: 4,
      capa: 'exterior',
      tempIdealMin: 8,
      tempIdealMax: 18,
      resisteLluvia: true,
      transpirable: false,
    },
    outfit: {
      slot: 'exterior',
      colorDominante: COLORES.negro.hex,
      combinaCon: ['surco', 'bija', 'arcilla'],
    },
  },
  {
    slug: 'vetas',
    nombre: 'Vetas',
    coleccion: COLECCION,
    tipo: 'pantalon',
    material: 'Pana',
    descripcion:
      'Las estrías de la pana leídas como estratos de tierra. La segunda de las dos piezas únicas de la colección.',
    precio: 100000,
    precioEstimado: true,
    piezaUnica: true,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-PAN-PNA-CAF-M', talla: 'M', color: COLORES.cafe, stock: 1 },
    ],
    clima: {
      abrigo: 3,
      capa: 'base',
      tempIdealMin: 10,
      tempIdealMax: 20,
      resisteLluvia: false,
      transpirable: false,
    },
    outfit: {
      slot: 'piernas',
      colorDominante: COLORES.cafe.hex,
      combinaCon: ['corteza', 'bija', 'cobijo'],
    },
  },
  {
    slug: 'sedimento',
    nombre: 'Sedimento',
    coleccion: COLECCION,
    tipo: 'sudadera',
    material: 'Burda',
    descripcion:
      'Lo que se asienta con el tiempo. Cuatro colores de tierra, tres tallas, una unidad por combinación: es el piso de la colección.',
    precio: 90000,
    precioEstimado: false,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-SUD-BUR-NEG-S', talla: 'S', color: COLORES.negro, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-NEG-M', talla: 'M', color: COLORES.negro, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-NEG-L', talla: 'L', color: COLORES.negro, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-CAF-S', talla: 'S', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-CAF-M', talla: 'M', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-CAF-L', talla: 'L', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-VIN-S', talla: 'S', color: COLORES.vinotinto, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-VIN-M', talla: 'M', color: COLORES.vinotinto, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-VIN-L', talla: 'L', color: COLORES.vinotinto, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-VER-S', talla: 'S', color: COLORES.verde, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-VER-M', talla: 'M', color: COLORES.verde, stock: 1 },
      { sku: 'VOID-MUL-SUD-BUR-VER-L', talla: 'L', color: COLORES.verde, stock: 1 },
    ],
    clima: {
      abrigo: 3,
      capa: 'media',
      tempIdealMin: 12,
      tempIdealMax: 22,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'torso',
      colorDominante: COLORES.vinotinto.hex,
      combinaCon: ['surco', 'arcilla', 'vetas'],
    },
  },
  {
    slug: 'cauce',
    nombre: 'Cauce',
    coleccion: COLECCION,
    tipo: 'sudadera',
    material: 'Náutica',
    descripcion:
      'El agua que talla la tierra. Tres tallas, una unidad cada una.',
    precio: 95000,
    precioEstimado: true,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-SUD-NAU-VER-S', talla: 'S', color: COLORES.verde, stock: 1 },
      { sku: 'VOID-MUL-SUD-NAU-VER-M', talla: 'M', color: COLORES.verde, stock: 1 },
      { sku: 'VOID-MUL-SUD-NAU-VER-L', talla: 'L', color: COLORES.verde, stock: 1 },
    ],
    clima: {
      abrigo: 3,
      capa: 'media',
      tempIdealMin: 12,
      tempIdealMax: 22,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'torso',
      colorDominante: COLORES.verde.hex,
      combinaCon: ['surco', 'arcilla'],
    },
  },
  // Bīja, Corteza y Cobijo: tres unidades cada una, todas en talla M, y cada
  // unidad es un diseño y un color distinto. No son stock de un mismo producto.
  // Los colores de abajo son PROVISIONALES — hay que reemplazarlos por los
  // reales cuando estén definidos, junto con las descripciones por unidad.
  {
    slug: 'bija',
    nombre: 'Bīja',
    coleccion: COLECCION,
    tipo: 'camiseta',
    material: 'Jacquard',
    descripcion:
      'Semilla. La sílaba germen del chakra raíz es LAM, y la prenda más ligera de la colección lleva el concepto más pequeño. Tres diseños distintos, uno por unidad.',
    precio: 55000,
    precioEstimado: true,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-CAM-JAC-CRE-M', talla: 'M', color: COLORES.crema, stock: 1 },
      { sku: 'VOID-MUL-CAM-JAC-VER-M', talla: 'M', color: COLORES.verde, stock: 1 },
      { sku: 'VOID-MUL-CAM-JAC-CAB-M', talla: 'M', color: COLORES.cabernet, stock: 1 },
    ],
    clima: {
      abrigo: 1,
      capa: 'base',
      tempIdealMin: 18,
      tempIdealMax: 30,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'torso',
      colorDominante: COLORES.crema.hex,
      combinaCon: ['surco', 'arcilla', 'kanda', 'corteza'],
    },
  },
  {
    slug: 'corteza',
    nombre: 'Corteza',
    coleccion: COLECCION,
    tipo: 'saco',
    material: 'Burda con Mónaco',
    descripcion:
      'Capa exterior, lo que protege. Tres diseños distintos, uno por unidad.',
    precio: 100000,
    precioEstimado: false,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-SAC-BUR-VIN-M', talla: 'M', color: COLORES.vinotinto, stock: 1 },
      { sku: 'VOID-MUL-SAC-BUR-CAF-M', talla: 'M', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-SAC-BUR-VER-M', talla: 'M', color: COLORES.verde, stock: 1 },
    ],
    clima: {
      abrigo: 4,
      capa: 'exterior',
      tempIdealMin: 8,
      tempIdealMax: 18,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'exterior',
      colorDominante: COLORES.vinotinto.hex,
      combinaCon: ['bija', 'surco', 'vetas', 'arcilla'],
    },
  },
  {
    slug: 'cobijo',
    nombre: 'Cobijo',
    coleccion: COLECCION,
    tipo: 'hoodie',
    material: 'Acolchado pesado / algodón perchado',
    descripcion:
      'La prenda más abrigada nombra directamente la seguridad, que es la virtud del chakra raíz. Tres diseños distintos, uno por unidad.',
    precio: 110000,
    precioEstimado: true,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-HOO-ACO-CAF-M', talla: 'M', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-HOO-ACO-BUR-M', talla: 'M', color: COLORES.burdeos, stock: 1 },
      { sku: 'VOID-MUL-HOO-ACO-TER-M', talla: 'M', color: COLORES.terracota, stock: 1 },
    ],
    clima: {
      abrigo: 4,
      capa: 'media',
      tempIdealMin: 8,
      tempIdealMax: 18,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'torso',
      colorDominante: COLORES.cafe.hex,
      combinaCon: ['surco', 'arcilla', 'vetas'],
    },
  },
  {
    slug: 'surco',
    nombre: 'Surco',
    coleccion: COLECCION,
    tipo: 'pantalon',
    material: 'Drill twill',
    descripcion:
      'El diagonal del twill es literalmente un surco. Tres tallas, una unidad cada una.',
    precio: 100000,
    precioEstimado: true,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-PAN-DRT-CAF-S', talla: 'S', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-PAN-DRT-CAF-M', talla: 'M', color: COLORES.cafe, stock: 1 },
      { sku: 'VOID-MUL-PAN-DRT-CAF-L', talla: 'L', color: COLORES.cafe, stock: 1 },
    ],
    clima: {
      abrigo: 2,
      capa: 'base',
      tempIdealMin: 15,
      tempIdealMax: 26,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'piernas',
      colorDominante: COLORES.cafe.hex,
      combinaCon: ['sedimento', 'bija', 'corteza', 'cobijo'],
    },
  },
  {
    slug: 'arcilla',
    nombre: 'Arcilla',
    coleccion: COLECCION,
    tipo: 'pantalon',
    material: 'Paño delgado',
    descripcion:
      'Materia moldeable: la tierra antes de la forma. Tres tallas, una unidad cada una.',
    precio: 100000,
    precioEstimado: true,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-PAN-PAD-NEG-S', talla: 'S', color: COLORES.negro, stock: 1 },
      { sku: 'VOID-MUL-PAN-PAD-NEG-M', talla: 'M', color: COLORES.negro, stock: 1 },
      { sku: 'VOID-MUL-PAN-PAD-NEG-L', talla: 'L', color: COLORES.negro, stock: 1 },
    ],
    clima: {
      abrigo: 2,
      capa: 'base',
      tempIdealMin: 14,
      tempIdealMax: 24,
      resisteLluvia: false,
      transpirable: true,
    },
    outfit: {
      slot: 'piernas',
      colorDominante: COLORES.negro.hex,
      combinaCon: ['sedimento', 'bija', 'corteza', 'cauce'],
    },
  },
  {
    slug: 'ofrenda',
    nombre: 'Ofrenda',
    coleccion: COLECCION,
    tipo: 'tote',
    material: 'Pana',
    descripcion: 'Lo que se carga y lo que se entrega.',
    // PENDIENTE: precio sin definir.
    precio: 0,
    precioEstimado: true,
    piezaUnica: false,
    imagenes: [],
    variantes: [
      { sku: 'VOID-MUL-TOT-PNA-CAF-U', talla: 'U', color: COLORES.cafe, stock: 2 },
    ],
    clima: {
      abrigo: 1,
      capa: 'accesorio',
      tempIdealMin: 0,
      tempIdealMax: 40,
      resisteLluvia: false,
      transpirable: false,
    },
    outfit: {
      slot: 'accesorio',
      colorDominante: COLORES.cafe.hex,
      combinaCon: [],
    },
  },
  {
    slug: 'vestigio',
    nombre: 'Vestigio',
    coleccion: COLECCION,
    tipo: 'tote',
    material: 'Upcycling de pantalones',
    descripcion:
      'Hechas con seis pantalones viejos: cada una es rastro de algo anterior. Ninguna se repite.',
    // PENDIENTE: precio y cantidad sin definir. Seis pantalones rinden un número
    // de bolsos que todavía hay que estimar.
    precio: 0,
    precioEstimado: true,
    piezaUnica: true,
    imagenes: [],
    variantes: [],
    clima: {
      abrigo: 1,
      capa: 'accesorio',
      tempIdealMin: 0,
      tempIdealMax: 40,
      resisteLluvia: false,
      transpirable: false,
    },
    outfit: {
      slot: 'accesorio',
      colorDominante: COLORES.cafe.hex,
      combinaCon: [],
    },
  },
];

export const muladhara: Coleccion = {
  slug: COLECCION,
  numero: 1,
  nombre: 'Mūlādhāra',
  chakra: {
    elemento: 'Tierra',
    mantra: 'LAM',
    emocionBloqueo: 'Miedo',
    virtud: 'Seguridad',
  },
  estado: 'activa',
  manifiesto:
    'Con cada prenda reconectamos no solo con la tierra sino con nosotros mismos. ' +
    'Los colores tierra recuperan el poder y la confianza que habíamos perdido, y ' +
    'restauran la calidez, la calma y la estabilidad que solo la tierra da. ' +
    'Cada saco y cada pantalón reafirman nuestro lugar en el mundo.',
  tema: {
    colores: {
      fondo: '#EDE4D3',
      tinta: '#2E0C16',
      dominante: '#4A121F',
      dominanteAlt: '#6E1F2E',
      secundario: '#B5623C',
      terciario: '#5F6647',
      acento: '#9C4A2F',
      neutro: '#4A3728',
    },
    fuenteTitulo: 'Sinistre',
  },
  productos,
};
