import React from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Plus } from 'lucide-react';
//import MegaMenu from './MegaMenu';
import HoverMenuItem from './HoverMenuItem'; 
import CategoriesMegaMenu from './CategoriesMenu';
import PlusMenu from './PlusMenu';
import GlassSurface from './GlassSurface'
import Dock from './Dock';



interface NavbarProps {
  isNavVisible: boolean;
  isScrolled: boolean;
}

const GLASS_MODE: 'always' | 'on-scroll' = 'always';

const navItems = ["shop all"];

const Navbar = ({ isNavVisible, isScrolled }: NavbarProps) => {

  /*const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);*/
  const showGlass = GLASS_MODE === 'always' || isScrolled;
  const textTone = 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]';

  const items = [
          { icon: <Search size={20} />, label: 'Buscar', onClick: () => alert('Home!') },
          { icon: <Heart size={20} />, label: 'Favoritos', onClick: () => alert('Archive!') },
          { icon: <ShoppingBag size={20} />, label: 'Carrito', onClick: () => alert('Profile!') },
          { icon: <User size={20} />, label: 'Cuenta', onClick: () => alert('Settings!') },
        ];

  const barContent = (
    <div
      className={`container mx-auto px-4 h-16 flex items-center justify-between relative ${textTone}`}
    >
      <div
        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
          isNavVisible ? '!left-4 translate-x-0' : ''
        }`}
      >
        <Link href="/" className="text-2xl font-bold tracking-widest">
          V.O.I.D
        </Link>
      </div>

      {/* Navegación central */}
      <div
        className={`flex-grow flex items-center justify-center gap-35 transition-opacity duration-300 ease-in-out ${
          isNavVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="uppercase text-sm font-medium tracking-wider pb-1 bg-no-repeat bg-bottom transition-[background-size] duration-250 ease-in-out bg-[length:0%_2px] hover:bg-[length:100%_2px] bg-gradient-to-r from-white to-white"
          >
            {item}
          </a>
        ))}

        <HoverMenuItem menuContent={<CategoriesMegaMenu />}>
          {(isHovered) => (
            <a
              href="#"
              className={`uppercase text-sm font-medium tracking-wider pb-1 bg-no-repeat bg-bottom transition-[background-size] duration-300 ease-in-out bg-gradient-to-r from-white to-white ${
                isHovered ? 'bg-[length:100%_2px]' : 'bg-[length:0%_2px]'
              }`}
            >
              categories
            </a>
          )}
        </HoverMenuItem>

        <HoverMenuItem menuContent={<PlusMenu />}>
          {(isHovered) => (
            <button
              className={`uppercase text-sm font-medium tracking-wider cursor-pointer pb-1 bg-no-repeat bg-bottom transition-[background-size] duration-300 ease-in-out bg-gradient-to-r from-white to-white ${
                isHovered ? 'bg-[length:100%_2px]' : 'bg-[length:0%_2px]'
              }`}
            >
              <Plus size={16} />
            </button>
          )}
        </HoverMenuItem>
      </div>

      {/* Iconos de acción */}
      <div
        className={`flex items-center gap-4 transition-opacity duration-300 ease-in-out ${
          isNavVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >

        <Dock
          items={items}
          baseItemSize={22}   // tamaño en reposo de cada icono
          magnification={50}  // tamaño máximo al pasar el cursor
          distance={120}      // radio de influencia del cursor
          panelHeight={48} 
        />

      </div>
    </div>
  );

  return (
    <nav className="w-full relative z-50">
      {/* CAPA DE VIDRIO: va detrás del contenido y no recorta los dropdowns. */}
      {showGlass && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GlassSurface
            width="100%"
            height={64}
            borderRadius={100}
            blur={11}
            brightness={50}
            opacity={0.92}
            backgroundOpacity={0.05}
            saturation={1}
            displace={0.5}
            distortionScale={-160}
            className="w-full h-full"
          />
        </div>
      )}

      {/* CAPA DE CONTENIDO: encima del vidrio. Los menús pueden desbordar sin recortarse. */}
      <div className="relative z-10">{barContent}</div>
    </nav>
  );
};

export default Navbar;