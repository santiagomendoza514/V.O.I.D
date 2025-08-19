import React from 'react';

// Reutilizamos la lógica del efecto hover de los items del menú
const MenuItem = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="relative text-gray-600 hover:text-black hover:translate-x-3 transition-all duration-300 before:content-['➣'] before:absolute before:left-[-1em] before:top-0 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
    {children}
  </a>
);

const CategoriesMegaMenu = () => {
  return (
    <div className="
            absolute top-full left-1/2 -translate-x-1/2 mt-4
            w-[654px] bg-white text-black rounded-lg shadow-2xl p-6 
            grid grid-cols-3 gap-6">
      {/* Columna 1 */} 
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Por Prenda</h3>
        <MenuItem>Tops</MenuItem>
        <MenuItem>Bottoms</MenuItem>
        <MenuItem>Outerwear</MenuItem>
        <MenuItem>Knitwear</MenuItem>
      </div>
      
      {/* Columna 2 */}
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Por Fit</h3>
        <MenuItem>Oversized</MenuItem>
        <MenuItem>Slim Fit</MenuItem>
        <MenuItem>Relaxed</MenuItem>
        <MenuItem>Boxy</MenuItem>
      </div>
      
      {/* Columna 3 */}
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold uppercase tracking-wider text-sm mb-2">Accesorios</h3>
        <MenuItem>Gorras</MenuItem>
        <MenuItem>Bolsos</MenuItem>
        <MenuItem>Calcetines</MenuItem>
        <MenuItem>Joyeria</MenuItem>
      </div>
    </div>
  );
};

export default CategoriesMegaMenu;