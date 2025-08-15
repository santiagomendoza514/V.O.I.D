import React from 'react';
import { Search, Heart, ShoppingBag, User, Plus } from 'lucide-react';

interface NavbarProps {
  isNavVisible: boolean;
  isScrolled: boolean;
}

const navItems = ["shop all", "women", "men", "categories"];

const Navbar = ({ isNavVisible, isScrolled }: NavbarProps) => {
  return (
    <nav
      // El fondo de la Navbar ahora depende SOLO del scroll
      className={`w-full transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      {/* El color del texto también cambia */}
      <div
        className={`container mx-auto px-4 h-16 flex items-center justify-between relative transition-colors duration-300 ${
          isScrolled ? 'text-black' : 'text-white'
        }`}
      >
        
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
            isNavVisible ? '!left-4 translate-x-0' : ''
          }`}
        >
          <a href="/" className="text-2xl font-bold tracking-widest">
            V.O.I.D
          </a>
        </div>
        
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
            <Plus size={16} />
          </button>
        </div>

        <div
          className={`flex items-center gap-4 transition-opacity duration-300 ease-in-out ${
            isNavVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button><Search size={20} /></button>
          <button><Heart size={20} /></button>
          <button><ShoppingBag size={20} /></button>
          <button><User size={20} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;