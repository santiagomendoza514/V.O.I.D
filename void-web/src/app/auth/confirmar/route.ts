import { NextResponse, type NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { crearClienteServidor } from '@/lib/supabase/servidor';

/**
 * Aquí llega el enlace del correo de confirmación.
 *
 * Supabase puede mandar el enlace de dos formas según cómo esté la plantilla
 * del correo: con `?code=` (la de fábrica) o con `?token_hash=&type=` (la
 * recomendada para Next). Se aceptan las dos, así que funciona sin importar
 * cuál se use. En ambos casos el resultado es el mismo: la persona queda con
 * sesión iniciada y entra a su cuenta.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  let confirmado = false;

  if (supabaseConfigurado) {
    const supabase = await crearClienteServidor();
    if (code) {
      confirmado = !(await supabase.auth.exchangeCodeForSession(code)).error;
    } else if (tokenHash && type) {
      confirmado = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
    }
  }

  return NextResponse.redirect(
    `${origin}${confirmado ? '/cuenta?bienvenida=1' : '/entrar?error=confirmacion'}`
  );
}
