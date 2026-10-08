/**
 * Las credenciales públicas de Supabase, leídas una sola vez.
 *
 * `supabaseConfigurado` existe para que el sitio no se caiga si faltan las
 * variables. Sin ellas, crear un cliente lanza un error; y como el middleware
 * corre en cada petición, eso tumbaría todas las páginas a la vez. Con esta
 * comprobación, el sitio sigue funcionando y solo se apagan las funciones que
 * dependen de la base de datos.
 *
 * Next sustituye `process.env.NEXT_PUBLIC_*` en tiempo de compilación, por eso
 * se nombran de forma literal y no con una clave dinámica.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
