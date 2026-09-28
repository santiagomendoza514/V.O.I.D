import React, { useEffect, useState } from 'react';
import GlassSurface from './GlassSurface';

/* ---------- Datos ---------- */

type Coleccion = {
  id: string;
  nombre: string;
  disponible: boolean;
  imagenes: string[];
};

const COLECCIONES: Coleccion[] = [
  {
    id: 'muladhara',
    nombre: 'Mūlādhāra',
    disponible: true,
    imagenes: [
      '/ropa1.jpeg',
      '/ropa 2.jpeg',
      '/ropa 3.jpeg',
    ],
  },
  { id: 'svadhisthana', nombre: 'Svādhiṣṭhāna', disponible: false, imagenes: [] },
  { id: 'manipura', nombre: 'Maṇipūra', disponible: false, imagenes: [] },
];

const IMAGEN_POR_DEFECTO = '/black.jpg';
const IMAGEN_COMING_SOON = '/comingsoon.jpg';
const INTERVALO_SLIDE_MS = 2000;

/* ---------- MenuItem ---------- */

const BASE =
  "relative transition-all duration-300 hover:translate-x-3 focus-visible:translate-x-3 outline-none " +
  "before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 " +
  "hover:before:opacity-100 focus-visible:before:opacity-100 before:transition-opacity before:duration-300";

// Clases completas (no construidas dinámicamente) para que Tailwind las genere
const VARIANTES = {
  disponible:
    'text-white/70 hover:text-red-500 focus-visible:text-red-500 hover:underline',
  noDisponible:
    'text-white/70 hover:text-white/30 focus-visible:text-white/30 hover:line-through focus-visible:line-through cursor-not-allowed',
};

type MenuItemProps = {
  children: React.ReactNode;
  disponible: boolean;
  onActivar: () => void;
};

const MenuItem = ({ children, disponible, onActivar }: MenuItemProps) => (
  <a
    href="#"
    aria-disabled={!disponible}
    onMouseEnter={onActivar}
    onFocus={onActivar}
    onClick={(e) => {
      if (!disponible) e.preventDefault();
    }}
    className={`${BASE} ${disponible ? VARIANTES.disponible : VARIANTES.noDisponible}`}
  >
    {children}
  </a>
);

/* ---------- Capa de imagen reutilizable ---------- */

const Capa = ({
  src,
  visible,
  children,
}: {
  src: string;
  visible: boolean;
  children?: React.ReactNode;
}) => (
  <div
    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
      visible ? 'opacity-100' : 'opacity-0'
    }`}
    style={{ backgroundImage: `url('${src}')` }}
  >
    {children}
  </div>
);

/* ---------- Slide ---------- */

const SlideColeccion = ({ imagenes, activo }: { imagenes: string[]; activo: boolean }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!activo || imagenes.length < 2) {
      setIndice(0); // reinicia para empezar siempre en la primera foto
      return;
    }
    const id = setInterval(
      () => setIndice((i) => (i + 1) % imagenes.length),
      INTERVALO_SLIDE_MS
    );
    return () => clearInterval(id); // evita intervalos duplicados
  }, [activo, imagenes.length]);

  return (
    <>
      {imagenes.map((src, i) => (
        <Capa key={src} src={src} visible={activo && i === indice} />
      ))}
    </>
  );
};

/* ---------- PlusMenu ---------- */

const PlusMenu = () => {
  const [activa, setActiva] = useState<Coleccion | null>(null);

  const mostrarDefault = activa === null;
  const mostrarComingSoon = activa !== null && !activa.disponible;

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4"
      onMouseLeave={() => setActiva(null)}
    >
      <GlassSurface
        width={600}
        height={176}
        borderRadius={12}
        blur={14}
        brightness={55}
        opacity={0.9}
        backgroundOpacity={0.06}
        saturation={1.1}
        distortionScale={-150}
      >
        <div className="grid grid-cols-2 p-6 w-full h-full text-white">
          {/* Columna 1 */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Colecciones</h3>
            {COLECCIONES.map((c) => (
              <MenuItem key={c.id} disponible={c.disponible} onActivar={() => setActiva(c)}>
                {c.nombre}
              </MenuItem>
            ))}
          </div>

          {/* Columna 2: capas apiladas */}
          <div className="relative overflow-hidden rounded-md border border-black">
            <Capa src={IMAGEN_POR_DEFECTO} visible={mostrarDefault} />

            {COLECCIONES.filter((c) => c.disponible).map((c) => (
              <SlideColeccion key={c.id} imagenes={c.imagenes} activo={activa?.id === c.id} />
            ))}

            <Capa src={IMAGEN_COMING_SOON} visible={mostrarComingSoon}>
              {/* Texto de respaldo; bórralo si tu imagen ya incluye el aviso */}
              <div className="flex h-full items-center justify-center bg-black/50">
                <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                  Coming soon…
                </span>
              </div>
            </Capa>
          </div>
        </div>
      </GlassSurface>
    </div>
  );
};

export default PlusMenu;