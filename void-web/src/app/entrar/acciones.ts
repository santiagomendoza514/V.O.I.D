'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { crearClienteServidor } from '@/lib/supabase/servidor';

export interface EstadoAcceso {
  error?: string;
  /** Si viene, el registro salió bien y falta confirmar el correo. */
  revisaCorreo?: string;
}

const NO_DISPONIBLE = 'El acceso no está disponible en este momento. Inténtalo más tarde.';

/** Los errores de Supabase llegan en inglés y en jerga técnica. */
function traducir(error: { message: string; code?: string; status?: number }): string {
  const codigo = error.code ?? '';
  const mensaje = error.message.toLowerCase();

  if (codigo === 'invalid_credentials' || mensaje.includes('invalid login credentials'))
    return 'Correo o contraseña incorrectos.';
  if (codigo === 'email_not_confirmed' || mensaje.includes('email not confirmed'))
    return 'Confirma tu correo antes de entrar: te enviamos un enlace al registrarte.';
  if (codigo === 'user_already_exists' || mensaje.includes('already registered'))
    return 'Ya existe una cuenta con ese correo. Entra con tu contraseña.';
  if (codigo === 'weak_password' || mensaje.includes('password should'))
    return 'Esa contraseña es muy débil. Usa al menos 8 caracteres.';
  if (codigo === 'email_address_invalid' || mensaje.includes('invalid email'))
    return 'Ese correo no parece válido. Revísalo.';
  if (codigo === 'captcha_failed' || mensaje.includes('captcha'))
    return 'No pudimos verificar que eres una persona. Inténtalo de nuevo.';
  if (codigo === 'over_email_send_rate_limit' || mensaje.includes('sending'))
    return 'No pudimos enviarte el correo de confirmación. Inténtalo en unos minutos.';
  if (codigo.startsWith('over_') || error.status === 429 || mensaje.includes('rate limit'))
    return 'Demasiados intentos seguidos. Espera un momento y vuelve a intentarlo.';
  if (codigo === 'signup_disabled')
    return 'El registro está cerrado por ahora.';
  return 'Algo salió mal. Inténtalo de nuevo.';
}

/**
 * A dónde ir después de entrar. Solo se aceptan rutas internas: si se aceptara
 * cualquier valor, un enlace como /entrar?siguiente=https://sitio-falso.com
 * mandaría a tus clientes, recién autenticados, a otra página.
 */
function destinoSeguro(valor: FormDataEntryValue | null): string {
  const s = typeof valor === 'string' ? valor : '';
  return s.startsWith('/') && !s.startsWith('//') ? s : '/cuenta';
}

/** Token de Cloudflare Turnstile. Supabase lo verifica si la protección está activa. */
function tokenCaptcha(formData: FormData): string | undefined {
  const token = formData.get('cf-turnstile-response');
  return typeof token === 'string' && token ? token : undefined;
}

export async function entrar(_previo: EstadoAcceso, formData: FormData): Promise<EstadoAcceso> {
  if (!supabaseConfigurado) return { error: NO_DISPONIBLE };

  const correo = String(formData.get('correo') ?? '').trim();
  const contrasena = String(formData.get('contrasena') ?? '');
  if (!correo || !contrasena) return { error: 'Escribe tu correo y tu contraseña.' };

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
    options: { captchaToken: tokenCaptcha(formData) },
  });
  if (error) return { error: traducir(error) };

  // redirect() lanza una excepción a propósito: tiene que quedar fuera de
  // cualquier try/catch, o Next no puede hacer la redirección.
  redirect(destinoSeguro(formData.get('siguiente')));
}

export async function registrarse(
  _previo: EstadoAcceso,
  formData: FormData
): Promise<EstadoAcceso> {
  if (!supabaseConfigurado) return { error: NO_DISPONIBLE };

  const nombre = String(formData.get('nombre') ?? '').trim();
  const correo = String(formData.get('correo') ?? '').trim();
  const contrasena = String(formData.get('contrasena') ?? '');

  if (!nombre || !correo) return { error: 'Escribe tu nombre y tu correo.' };
  if (contrasena.length < 8) return { error: 'La contraseña necesita al menos 8 caracteres.' };

  // El enlace del correo de confirmación tiene que volver a este mismo sitio:
  // localhost en desarrollo, Vercel en producción.
  const h = await headers();
  const origen = h.get('origin') ?? `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`;

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
    options: {
      data: { nombre },
      emailRedirectTo: `${origen}/auth/confirmar`,
      captchaToken: tokenCaptcha(formData),
    },
  });
  if (error) return { error: traducir(error) };

  // Si la confirmación de correo está desactivada, ya hay sesión.
  if (data.session) redirect('/cuenta');

  // Si el correo ya tenía cuenta, Supabase responde igual que si fuera nuevo y
  // no envía nada. Es deliberado: así nadie puede averiguar qué correos están
  // registrados probando en este formulario. Por eso siempre se muestra lo mismo.
  return { revisaCorreo: correo };
}
