import React from 'react';

interface MegaMenuProps {
  isOpen: boolean;
}

const MegaMenu = ({ isOpen }: MegaMenuProps) => {
  return (
    <div
      className={`
        absolute top-full left-1/2 -translate-x-1/2 mt-4
        w-[654px] h-[176px] 
        bg-white text-black rounded-lg shadow-2xl p-6
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
      `}
    >
      {/* Contenido del Megamenú - Ejemplo de 3 columnas */}
      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Columna 1 */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Colecciones</h3>
          <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">Nueva Temporada</a>
          <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">Core Essentials</a>
          <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">Exclusivos Online</a>
        </div>
        
        {/* Columna 2 */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Estilos</h3>
          <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">Oversized</a>
          <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">Minimalista</a>
          <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">Urbano</a>
        </div>
        
        {/* Columna 3 - Podría ser una imagen promocional */}
        <div className="bg-gray-200 rounded-md bg-cover bg-center" style={{backgroundImage: "url('/hero-background.jpg')"}}>
          {/* Puedes poner texto aquí si quieres */}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;