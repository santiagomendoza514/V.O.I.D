import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, Plus } from 'lucide-react';
//import MegaMenu from './MegaMenu';
import HoverMenuItem from './HoverMenuItem'; 
import CategoriesMegaMenu from './CategoriesMenu';
import PlusMenu from './PlusMenu';



interface NavbarProps {
  isNavVisible: boolean;
  isScrolled: boolean;
}

const navItems = ["shop all"];

const Navbar = ({ isNavVisible, isScrolled }: NavbarProps) => {

  /*const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);*/

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
          className={`flex-grow flex items-center justify-center gap-35 transition-opacity duration-300 ease-in-out ${
            isNavVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {navItems.map((item) => (
            <a key={item} href="#" className={`
                uppercase text-sm font-medium tracking-wider pb-1
                bg-no-repeat bg-bottom
                transition-[background-size] duration-250 ease-in-out
                bg-[length:0%_2px] hover:bg-[length:100%_2px]
                ${isScrolled ? 'bg-gradient-to-r from-black to-black' : 'bg-gradient-to-r from-white to-white'}
              `}
              >
              {item}
            </a>
          ))}

          <HoverMenuItem menuContent={<CategoriesMegaMenu />}>
            {(isHovered) => (
              <a href="#" className={`uppercase text-sm font-medium tracking-wider pb-1 bg-no-repeat bg-bottom transition-[background-size] duration-300 ease-in-out
                ${isHovered ? 'bg-[length:100%_2px]' : 'bg-[length:0%_2px]'}
                ${isScrolled ? 'bg-gradient-to-r from-black to-black' : 'bg-gradient-to-r from-white to-white'}
              `}>
                categories
              </a>
            )}
          </HoverMenuItem>

          <HoverMenuItem menuContent={<PlusMenu />}> 
            {(isHovered) => (
              <button className={`uppercase text-sm font-medium tracking-wider cursor-pointer pb-1 bg-no-repeat bg-bottom transition-[background-size] duration-300 ease-in-out
                ${isHovered ? 'bg-[length:100%_2px]' : 'bg-[length:0%_2px]'}
                ${isScrolled ? 'bg-gradient-to-r from-black to-black' : 'bg-gradient-to-r from-white to-white'}
              `}>
                <Plus size={16} />
              </button>
            )}
          </HoverMenuItem>

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