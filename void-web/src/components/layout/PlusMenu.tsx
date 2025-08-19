import React from 'react';

const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
    {children}
  </a>
);

const PlusMenu = () => {
  return (
    <div className="
            absolute top-full left-1/2 -translate-x-1/2 mt-4
            w-[654px] h-[176px]
            bg-white text-black rounded-lg shadow-2xl p-6 
            grid grid-cols-3 gap-6">
      {/* Columna 1 */} 
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Colecciones</h3>
        <MenuItem>Nueva Temporada</MenuItem>
        <MenuItem>Core Essentials</MenuItem>
        <MenuItem>Exclusivos Online</MenuItem>
      </div>
      
      {/* Columna 2 */}
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Estilos</h3>
        <MenuItem>Oversized</MenuItem>
        <MenuItem>Minimalista</MenuItem>
        <MenuItem>Urbano</MenuItem>
      </div>
      
      {/* Columna 3 */}
      <div className="bg-gray-200 rounded-md bg-cover bg-center" style={{backgroundImage: "url('/hero-background.jpg')"}}>
        
      </div>
    </div>
  );
};


export default PlusMenu;