import type { Coleccion } from '../tipos';
import { muladhara } from './muladhara';




/**
 * Las siete colecciones, en orden ascendente de chakra. Solo Mūlādhāra tiene
 * catálogo; las otras seis existen aquí para que el sitio pueda mostrar el
 * recorrido completo desde el primer día — la metáfora de ascenso necesita ver
 * hacia dónde sube.
 *
 * Cuando una colección se active: crear su archivo con productos y tema, e
 * importarlo aquí en lugar del marcador.
 */

type ColeccionProxima = Pick<Coleccion, 'slug' | 'numero' | 'nombre' | 'chakra' | 'estado'>;

const proximas: ColeccionProxima[] = [
  {
    slug: 'svadhisthana',
    numero: 'II',
    nombre: 'Svādhiṣṭhāna',
    chakra: { elemento: 'Agua', mantra: 'VAM', emocionBloqueo: 'Culpa', virtud: 'Creatividad' },
    estado: 'proxima',
  },
  {
    slug: 'manipura',
    numero: 'III',
    nombre: 'Maṇipūra',
    chakra: { elemento: 'Fuego', mantra: 'RAM', emocionBloqueo: 'Vergüenza', virtud: 'Voluntad' },
    estado: 'proxima',
  },
  {
    slug: 'anahata',
    numero: 'IV',
    nombre: 'Anāhata',
    chakra: { elemento: 'Aire', mantra: 'YAM', emocionBloqueo: 'Duelo', virtud: 'Amor' },
    estado: 'proxima',
  },
  {
    slug: 'vishuddha',
    numero: 'V',
    nombre: 'Viśuddha',
    chakra: { elemento: 'Éter', mantra: 'HAM', emocionBloqueo: 'Mentira', virtud: 'Verdad' },
    estado: 'proxima',
  },
  {
    slug: 'ajna',
    numero: 'VI',
    nombre: 'Ājñā',
    chakra: { elemento: 'Luz', mantra: 'OM', emocionBloqueo: 'Ilusión', virtud: 'Intuición' },
    estado: 'proxima',
  },
  {
    slug: 'sahasrara',
    numero: 'VII',
    nombre: 'Sahasrāra',
    chakra: { elemento: 'Consciencia', mantra: 'Silencio', emocionBloqueo: 'Apego', virtud: 'Unidad' },
    estado: 'proxima',
  },
];

/** Colecciones con catálogo. Son las únicas navegables. */
export const colecciones: Coleccion[] = [muladhara];

/** Las siete, para el recorrido completo. Las próximas no tienen productos. */
export const recorrido: (Coleccion | ColeccionProxima)[] = [muladhara, ...proximas];

export function obtenerColeccion(slug: string): Coleccion | undefined {
  return colecciones.find((c) => c.slug === slug);
}

export function obtenerProducto(slugColeccion: string, slugProducto: string) {
  return obtenerColeccion(slugColeccion)?.productos.find((p) => p.slug === slugProducto);
}

/** Slugs para `generateStaticParams` de /colecciones/[slug]. */
export function slugsDeColecciones(): string[] {
  return colecciones.map((c) => c.slug);
}

export function porNumero(numero: string) {
  return recorrido.find((c) => c.numero === numero);
}



export { muladhara };


