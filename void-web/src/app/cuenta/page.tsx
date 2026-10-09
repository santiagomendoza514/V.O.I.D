import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RUTAS } from '@/lib/enlaces';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { crearClienteServidor } from '@/lib/supabase/servidor';
import { salir } from './acciones';

export const metadata: Metadata = {
  title: 'Tu cuenta · V.O.I.D',
};

/**
 * La cuenta del usuario registrado. Por ahora es el punto de llegada tras
 * entrar; aquí crecerán el perfil, el avatar, los pedidos y los favoritos.
 *
 * Es la página que abre el ítem de cuenta del Dock. Si no hay sesión, manda a
 * /entrar y, al entrar, regresa aquí: así el Dock no necesita saber nada.
 */
export default async function PaginaCuenta({
  searchParams,
}: {
  searchParams: Promise<{ bienvenida?: string }>;
}) {
  if (!supabaseConfigurado) redirect(RUTAS.entrar);

  const supabase = await crearClienteServidor();
  // getUser y no getSession: getSession lee la cookie sin comprobarla, y una
  // cookie se puede fabricar. getUser le pregunta a Supabase si es auténtica.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`${RUTAS.entrar}?siguiente=${encodeURIComponent(RUTAS.cuenta)}`);

  const { bienvenida } = await searchParams;
  const nombre = (user.user_metadata?.nombre as string | undefined)?.trim();

  return (
    <div className="min-h-screen bg-[var(--void-fondo)] px-6 py-10 text-[var(--void-tinta)] sm:px-12">
      <Link
        href="/"
        className="text-xl font-bold tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
      >
        V.O.I.D
      </Link>

      <div className="mx-auto mt-24 max-w-2xl">
        {bienvenida && (
          <p role="status" className="mb-8 border-l-2 border-[var(--void-exito)] px-4 py-3 text-sm">
            Tu correo quedó confirmado. Ya eres parte de V.O.I.D.
          </p>
        )}

        <h1 className="text-4xl font-light text-balance">
          {nombre ? `Hola, ${nombre}` : 'Tu cuenta'}
        </h1>
        <p className="mt-3 text-[var(--void-tinta-dim)]">{user.email}</p>

        <div className="mt-14 border-t border-[var(--void-linea)] pt-8">
          <p className="max-w-[52ch] leading-relaxed text-[var(--void-tinta-dim)]">
            Aquí vas a encontrar tu perfil, tus pedidos y tus favoritos. Mientras tanto, la
            colección te espera.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href={RUTAS.coleccionActiva}
              className="bg-[var(--void-tinta)] px-6 py-3.5 text-xs uppercase tracking-[0.18em] text-[var(--void-fondo)] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void-fondo)]"
            >
              Ver la colección
            </Link>
            <form action={salir}>
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.16em] text-[var(--void-tinta-dim)] underline-offset-4 hover:text-[var(--void-tinta)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
