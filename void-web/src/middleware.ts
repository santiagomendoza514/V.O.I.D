import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from '@/lib/supabase/config';

export async function middleware(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  // Sin credenciales no hay sesión que refrescar. Se deja pasar la petición en
  // vez de lanzar un error, que en el middleware tumbaría el sitio entero.
  if (!supabaseConfigurado) return respuesta;

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(nuevas) {
          nuevas.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          nuevas.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca la sesión. No borres esta línea aunque parezca que no hace nada.
  // Si Supabase no responde, la página carga igual: un visitante sin sesión
  // refrescada es mejor que un sitio que no abre.
  try {
    await supabase.auth.getUser();
  } catch {
    // La sesión se reintenta en la siguiente petición.
  }

  return respuesta;
}

export const config = {
  // No corre para archivos estáticos ni imágenes.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};