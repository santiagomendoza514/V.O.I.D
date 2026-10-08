import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function crearClienteServidor() {
  const almacen = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return almacen.getAll();
        },
        setAll(nuevas) {
          try {
            nuevas.forEach(({ name, value, options }) =>
              almacen.set(name, value, options)
            );
          } catch {
            // Un Server Component no puede escribir cookies. No pasa nada:
            // el middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}