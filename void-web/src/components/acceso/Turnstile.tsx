'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile: la casilla de "soy una persona", y la protección real
 * contra bots.
 *
 * Se muestra siempre como casilla ("Verify you are human"). El token que
 * entrega va dentro del formulario y Supabase lo verifica en su servidor; esa
 * verificación del lado del servidor es lo que de verdad frena a un bot.
 *
 * Por qué no reCAPTCHA ("I'm not a robot"): Supabase solo verifica hCaptcha y
 * Turnstile. Con reCAPTCHA, un bot podría registrarse llamando a Supabase
 * directamente, porque Supabase no sabría comprobar el token.
 *
 * Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY: en desarrollo se usa una llave de prueba
 * pública de Cloudflare, para que la casilla se vea y se pueda probar; en
 * producción no se dibuja nada y el formulario queda sin protección. Ver
 * docs/acceso-y-navegacion.md.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opciones: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

/**
 * Llave de prueba que publica Cloudflare: siempre pide marcar la casilla y
 * siempre la aprueba. Solo para ver y probar la casilla en desarrollo; no
 * protege nada y nunca se usa en producción.
 */
const LLAVE_DE_PRUEBA = '3x00000000000000000000FF';

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  (process.env.NODE_ENV === 'development' ? LLAVE_DE_PRUEBA : '');

export type EstadoTurnstile = 'verificando' | 'listo' | 'fallo';

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let cargando: Promise<void> | null = null;

function cargarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (cargando) return cargando;
  cargando = new Promise((resolver, rechazar) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolver();
    s.onerror = () => {
      cargando = null;
      rechazar(new Error('Turnstile no cargó'));
    };
    document.head.appendChild(s);
  });
  return cargando;
}

/**
 * Para que el token se renueve tras un intento fallido (cada token sirve una
 * sola vez), el formulario vuelve a montar este componente cambiándole la `key`.
 */
export default function Turnstile({
  accion,
  onEstado,
}: {
  accion: string;
  /** Debe ser estable (useCallback): si cambia, el widget se vuelve a crear. */
  onEstado: (estado: EstadoTurnstile) => void;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let id: string | undefined;
    let vivo = true;
    onEstado('verificando');

    cargarScript()
      .then(() => {
        if (!vivo || !caja.current || !window.turnstile) return;
        id = window.turnstile.render(caja.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: accion,
          appearance: 'always',
          // Ocupa el ancho del formulario: con el ancho fijo de 300 px, el texto
          // en español ("Verifique que es un ser humano") no cabe y se corta.
          size: 'flexible',
          theme: 'dark',
          callback: () => onEstado('listo'),
          'expired-callback': () => onEstado('verificando'),
          // Si Cloudflare falla, no se deja el botón bloqueado para siempre:
          // se libera y Supabase decide. Un error claro es mejor que un botón muerto.
          'error-callback': () => onEstado('fallo'),
        });
      })
      .catch(() => vivo && onEstado('fallo'));

    return () => {
      vivo = false;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [accion, onEstado]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={caja} className="w-full empty:hidden" />;
}
