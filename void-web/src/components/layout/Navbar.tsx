import React from 'react';
import { Search, Heart, ShoppingBag, User, Plus } from 'lucide-react';

// Definimos el tipo de las props que recibirá el componente
interface NavbarProps {
  isNavVisible: boolean;
}

const navItems = ["shop all", "women", "men", "categories"];

const Navbar = ({ isNavVisible }: NavbarProps) => {
  return (
    <nav className="bg-white text-black shadow-md">
      <div className="container mx-auto px-4 h-25 flex items-center justify-between relative">
        {/* --- LOGO --- */}
        {/* La posición del logo cambia con 'isNavVisible' */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
            isNavVisible ? '!left-4 translate-x-0' : ''
          }`}
        >
          <a href="/" className="text-2xl font-bold tracking-widest">
            V.O.I.D
          </a>
        </div>

        {/* --- ITEMS DEL CENTRO --- */}
        {/* La opacidad y visibilidad de los items cambian con 'isNavVisible' */}
        <div
          className={`flex-grow flex items-center justify-center gap-8 transition-opacity duration-300 ease-in-out ${
            isNavVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {navItems.map((item) => (
            <a key={item} href="#" className="uppercase text-sm font-medium tracking-wider">
              {item}
            </a>
          ))}
          <button className="uppercase text-sm font-medium tracking-wider">
            <Plus size={25} />
          </button>
        </div>

        {/* --- ITEMS DE LA DERECHA (ICONOS) --- */}
        {/* La opacidad y visibilidad de los iconos también cambian */}
        <div
          className={`flex items-center gap-4 transition-opacity duration-300 ease-in-out ${
            isNavVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button><Search size={25} /></button>
          <button><Heart size={25} /></button>
          <button><ShoppingBag size={25} /></button>
          <button><User size={25} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;