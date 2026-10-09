import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import FormularioAcceso from '@/components/acceso/FormularioAcceso';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { crearClienteServidor } from '@/lib/supabase/servidor';

export const metadata: Metadata = {
  title: 'Entrar · V.O.I.D',
  description: 'Entra a tu cuenta de V.O.I.D o crea una nueva.',
};

const ERRORES: Record<string, string> = {
  confirmacion: 'El enlace de confirmación no es válido o ya expiró. Entra o regístrate de nuevo.',
};

export default async function PaginaEntrar({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string; siguiente?: string; error?: string }>;
}) {
  const { modo, siguiente, error } = await searchParams;

  // Quien ya tiene sesión no tiene nada que hacer aquí.
  if (supabaseConfigurado) {
    const supabase = await crearClienteServidor();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect('/cuenta');
  }

  return (
    // Es un formulario: pertenece a la cáscara V.O.I.D, no a la piel de la temporada.
    <div className="grid min-h-screen bg-[var(--void-fondo)] text-[var(--void-tinta)] lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/hero1.jpeg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/45" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-[#f0eae0]">
          <Link href="/" className="text-2xl font-bold tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]">
            V.O.I.D
          </Link>
          <blockquote className="max-w-[24ch] text-3xl font-light leading-snug text-balance">
            Un lugar donde del vacío se crea todo, donde el alma encuentra el estilo.
          </blockquote>
        </div>
      </aside>

      {/* El layout raíz ya pone el <main>: aquí va un div. */}
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Link
          href="/"
          className="mb-12 self-start text-xl font-bold tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)] lg:hidden"
        >
          V.O.I.D
        </Link>

        <div className="m-auto w-full max-w-sm">
          {supabaseConfigurado ? (
            <FormularioAcceso
              modoInicial={modo === 'registro' ? 'registro' : 'entrar'}
              siguiente={siguiente ?? '/cuenta'}
              errorInicial={error ? ERRORES[error] : undefined}
            />
          ) : (
            <p className="border-l-2 border-[var(--void-aviso)] px-4 py-3 text-sm">
              El acceso no está disponible en este momento. Inténtalo más tarde.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
