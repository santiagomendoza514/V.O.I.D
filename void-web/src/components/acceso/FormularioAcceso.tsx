'use client';

import { useActionState, useCallback, useEffect, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { entrar, registrarse, type EstadoAcceso } from '@/app/entrar/acciones';
import PlantaSemilla from './PlantaSemilla';
import Turnstile, { TURNSTILE_SITE_KEY, type EstadoTurnstile } from './Turnstile';

type Modo = 'entrar' | 'registro';

const ENTRADA =
  'w-full border border-[var(--void-linea-fuerte)] bg-transparent px-4 py-3 text-base text-[var(--void-tinta)] ' +
  'placeholder:text-[color-mix(in_srgb,var(--void-tinta-dim)_60%,transparent)] transition-colors ' +
  'focus:border-[var(--void-tinta)] focus:outline-none';
const ETIQUETA = 'mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--void-tinta-dim)]';
const BOTON =
  'w-full bg-[var(--void-tinta)] px-5 py-3.5 text-xs uppercase tracking-[0.18em] text-[var(--void-fondo)] ' +
  'transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)] ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void-fondo)] disabled:cursor-not-allowed disabled:opacity-35';

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="border-l-2 border-[var(--void-error)] bg-[color-mix(in_srgb,var(--void-error)_14%,transparent)] px-4 py-3 text-sm"
    >
      {children}
    </p>
  );
}

function Contrasena({
  id,
  valor,
  onCambio,
  nueva,
}: {
  id: string;
  valor: string;
  onCambio: (v: string) => void;
  nueva?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name="contrasena"
        type={visible ? 'text' : 'password'}
        required
        minLength={nueva ? 8 : undefined}
        autoComplete={nueva ? 'new-password' : 'current-password'}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        className={`${ENTRADA} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center text-[var(--void-tinta-dim)] hover:text-[var(--void-tinta)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

/** Cada intento gasta el token de Turnstile: tras un error hay que pedir otro. */
function useVerificacion(estado: EstadoAcceso) {
  const [turnstile, setTurnstile] = useState<EstadoTurnstile>(
    TURNSTILE_SITE_KEY ? 'verificando' : 'listo'
  );
  const [intento, setIntento] = useState(0);
  const alCambiar = useCallback((e: EstadoTurnstile) => setTurnstile(e), []);
  useEffect(() => {
    if (estado.error) setIntento((i) => i + 1);
  }, [estado]);
  return { verificando: turnstile === 'verificando', intento, alCambiar };
}

/* ---------- Entrar ---------- */

function FormEntrar({
  siguiente,
  errorInicial,
  onCambiarModo,
}: {
  siguiente: string;
  errorInicial?: string;
  onCambiarModo: () => void;
}) {
  const [estado, accion, pendiente] = useActionState<EstadoAcceso, FormData>(entrar, {
    error: errorInicial,
  });
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { verificando, intento, alCambiar } = useVerificacion(estado);
  const id = useId();

  const listo = correo.trim() !== '' && contrasena !== '';

  return (
    <form action={accion} className="flex flex-col gap-5">
      <input type="hidden" name="siguiente" value={siguiente} />

      <div>
        <label htmlFor={`${id}-correo`} className={ETIQUETA}>
          Correo
        </label>
        <input
          id={`${id}-correo`}
          name="correo"
          type="email"
          required
          autoComplete="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={ENTRADA}
        />
      </div>

      <div>
        <label htmlFor={`${id}-contrasena`} className={ETIQUETA}>
          Contraseña
        </label>
        <Contrasena id={`${id}-contrasena`} valor={contrasena} onCambio={setContrasena} />
      </div>

      <Turnstile key={intento} accion="entrar" onEstado={alCambiar} />

      {estado.error && <Aviso>{estado.error}</Aviso>}

      <button type="submit" disabled={!listo || pendiente || verificando} className={BOTON}>
        {pendiente ? 'Entrando…' : verificando && listo ? 'Verificando…' : 'Entrar'}
      </button>

      <p className="text-center text-sm text-[var(--void-tinta-dim)]">
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={onCambiarModo}
          className="text-[var(--void-tinta)] underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
        >
          Crea una
        </button>
      </p>
    </form>
  );
}

/* ---------- Crear cuenta ---------- */

function FormRegistro({ onCambiarModo }: { onCambiarModo: () => void }) {
  const [estado, accion, pendiente] = useActionState<EstadoAcceso, FormData>(registrarse, {});
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [plantada, setPlantada] = useState(false);
  const alPlantar = useCallback(() => setPlantada(true), []);
  const { verificando, intento, alCambiar } = useVerificacion(estado);
  const id = useId();

  const largoOk = contrasena.length >= 8;
  const listo = nombre.trim() !== '' && correo.trim() !== '' && largoOk && plantada;

  if (estado.revisaCorreo) {
    return (
      <div className="flex flex-col gap-4" role="status">
        <p className="text-2xl font-light">Revisa tu correo</p>
        <p className="leading-relaxed text-[var(--void-tinta-dim)]">
          Te enviamos un enlace a <span className="text-[var(--void-tinta)]">{estado.revisaCorreo}</span>{' '}
          para confirmar tu cuenta. Al abrirlo, entras directamente.
        </p>
        <p className="text-sm text-[var(--void-tinta-dim)]">
          ¿No te llegó? Revisa la carpeta de spam. Puede tardar un par de minutos.
        </p>
        <button
          type="button"
          onClick={onCambiarModo}
          className="mt-2 self-start text-sm underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
        >
          Volver a entrar
        </button>
      </div>
    );
  }

  return (
    <form action={accion} className="flex flex-col gap-5">
      <div>
        <label htmlFor={`${id}-nombre`} className={ETIQUETA}>
          Nombre
        </label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          required
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={ENTRADA}
        />
      </div>

      <div>
        <label htmlFor={`${id}-correo`} className={ETIQUETA}>
          Correo
        </label>
        <input
          id={`${id}-correo`}
          name="correo"
          type="email"
          required
          autoComplete="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={ENTRADA}
        />
      </div>

      <div>
        <label htmlFor={`${id}-contrasena`} className={ETIQUETA}>
          Contraseña
        </label>
        <Contrasena id={`${id}-contrasena`} valor={contrasena} onCambio={setContrasena} nueva />
        <p
          className="mt-2 text-xs transition-colors"
          style={{ color: largoOk ? 'var(--void-tinta)' : 'var(--void-tinta-dim)' }}
        >
          {largoOk ? '✓ ' : ''}Mínimo 8 caracteres
        </p>
      </div>

      <PlantaSemilla onPlantada={alPlantar} />

      <Turnstile key={intento} accion="registro" onEstado={alCambiar} />

      {estado.error && <Aviso>{estado.error}</Aviso>}

      <button type="submit" disabled={!listo || pendiente || verificando} className={BOTON}>
        {pendiente
          ? 'Creando tu cuenta…'
          : !plantada
            ? 'Planta la semilla para continuar'
            : verificando
              ? 'Verificando…'
              : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-[var(--void-tinta-dim)]">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={onCambiarModo}
          className="text-[var(--void-tinta)] underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
        >
          Entra
        </button>
      </p>
    </form>
  );
}

/* ---------- Contenedor con pestañas ---------- */

export default function FormularioAcceso({
  modoInicial,
  siguiente,
  errorInicial,
}: {
  modoInicial: Modo;
  siguiente: string;
  errorInicial?: string;
}) {
  const [modo, setModo] = useState<Modo>(modoInicial);
  const id = useId();

  // La pestaña queda en la URL: /entrar?modo=registro se puede enlazar y
  // recargar sin perder dónde estaba.
  const cambiar = (m: Modo) => {
    setModo(m);
    const url = new URL(window.location.href);
    if (m === 'registro') url.searchParams.set('modo', 'registro');
    else url.searchParams.delete('modo');
    url.searchParams.delete('error');
    window.history.replaceState(null, '', url);
  };

  const pestanas: { valor: Modo; texto: string }[] = [
    { valor: 'entrar', texto: 'Entrar' },
    { valor: 'registro', texto: 'Crear cuenta' },
  ];

  return (
    <div>
      {/* El título vive aquí y no en la página: tiene que cambiar con la pestaña. */}
      <h1 className="mb-2 text-3xl font-light">
        {modo === 'registro' ? 'Bienvenido al vacío' : 'Vuelve a entrar'}
      </h1>
      <p className="mb-10 text-sm leading-relaxed text-[var(--void-tinta-dim)]">
        {modo === 'registro'
          ? 'Crea tu cuenta para guardar favoritos, seguir tus pedidos y acceder a contenido exclusivo.'
          : 'Tus favoritos, tus pedidos y lo que solo ven los miembros.'}
      </p>

      <div role="tablist" aria-label="Acceso" className="relative mb-10 grid grid-cols-2">
        {pestanas.map((p) => (
          <button
            key={p.valor}
            id={`${id}-tab-${p.valor}`}
            type="button"
            role="tab"
            aria-selected={modo === p.valor}
            aria-controls={`${id}-panel`}
            onClick={() => cambiar(p.valor)}
            className="pb-3 text-sm uppercase tracking-[0.16em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--void-acento)]"
            style={{ color: modo === p.valor ? 'var(--void-tinta)' : 'var(--void-tinta-dim)' }}
          >
            {p.texto}
          </button>
        ))}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[var(--void-linea-fuerte)]" />
        <span
          aria-hidden="true"
          className="absolute bottom-0 h-0.5 w-1/2 bg-[var(--void-tinta)] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${modo === 'entrar' ? '0' : '100%'})` }}
        />
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${modo}`}>
        {modo === 'entrar' ? (
          <FormEntrar
            siguiente={siguiente}
            errorInicial={errorInicial}
            onCambiarModo={() => cambiar('registro')}
          />
        ) : (
          <FormRegistro onCambiarModo={() => cambiar('entrar')} />
        )}
      </div>
    </div>
  );
}
