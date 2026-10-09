import React from 'react';
import Link from 'next/link';
import GlassSurface from './GlassSurface';
import { PARTES, enlaceColeccion } from '@/lib/enlaces';

const BASE =
  "relative transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] " +
  'before:top-0 before:opacity-0 before:transition-opacity before:duration-300 outline-none';

/**
 * Cada ítem abre la colección ya filtrada. Sin `href` es una categoría que
 * todavía no tiene prendas: se ve, pero no lleva a una colección vacía.
 */
const MenuItem = ({ children, href }: { children: React.ReactNode; href?: string }) =>
  href ? (
    <Link
      href={href}
      className={`${BASE} text-white/70 hover:translate-x-3 hover:text-white hover:underline hover:before:opacity-100 focus-visible:translate-x-3 focus-visible:text-white focus-visible:before:opacity-100`}
    >
      {children}
    </Link>
  ) : (
    <span
      aria-disabled="true"
      title="Próximamente"
      className={`${BASE} cursor-not-allowed text-white/40 hover:line-through`}
    >
      {children}
    </span>
  );

const CategoriesMegaMenu = () => {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4">

      <GlassSurface
        width={654}
        height={240} // 4 filas + título; ajústalo si añades/quitas items
        borderRadius={12}
        blur={14}
        brightness={55}
        opacity={0.9}
        backgroundOpacity={0.06}
        saturation={1.1}
        distortionScale={-150}
      >
        <div className="grid grid-cols-3 gap-6 p-6 w-full h-full text-white">
          {/* Columna 1 */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Por Prenda</h3>
            <MenuItem href={enlaceColeccion({ tipo: PARTES.tops })}>Tops</MenuItem>
            <MenuItem href={enlaceColeccion({ tipo: PARTES.bottoms })}>Bottoms</MenuItem>
            <MenuItem>Coming soon...</MenuItem>
            <MenuItem>Coming soon...</MenuItem>
          </div>

          {/* Columna 2 */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Por Clima</h3>
            <MenuItem href={enlaceColeccion({ clima: ['calido'] })}>Cálido</MenuItem>
            <MenuItem href={enlaceColeccion({ clima: ['templado'] })}>Templado</MenuItem>
            {/* El catálogo distingue frío, templado, cálido y lluvia: "Caluroso"
                no tiene equivalente propio y por ahora lleva a cálido. */}
            <MenuItem href={enlaceColeccion({ clima: ['calido'] })}>Caluroso</MenuItem>
            <MenuItem href={enlaceColeccion({ clima: ['frio'] })}>Frío</MenuItem>
          </div>

          {/* Columna 3 */}
          <div className="flex flex-col space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Accesorios</h3>
            <MenuItem>Gorras</MenuItem>
            {/* Una tote bag es un bolso: por ahora llevan al mismo sitio. */}
            <MenuItem href={enlaceColeccion({ tipo: ['tote'] })}>Bolsos</MenuItem>
            <MenuItem>Boinas</MenuItem>
            <MenuItem href={enlaceColeccion({ tipo: ['tote'] })}>Tote Bags</MenuItem>
          </div>
        </div>

      </GlassSurface>

    </div>
  );
};

export default CategoriesMegaMenu;
