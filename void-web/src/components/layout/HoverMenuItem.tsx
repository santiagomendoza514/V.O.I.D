"use client";

import React, { useState, useRef } from 'react';

interface HoverMenuItemProps {
  children: (isHovered: boolean) => React.ReactNode;
  menuContent: React.ReactNode;
}

const HoverMenuItem = ({ children, menuContent }: HoverMenuItemProps) => {

  const [isOpen, setIsOpen] = useState(false);

 const timeoutRef = useRef<NodeJS.Timeout | null>(null);

 const handleMouseEnter = () => {
    // Si hay un timeout para cerrar, lo cancelamos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Creamos un timeout para cerrar el menú después de un breve retraso (100ms)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <div
      className={`relative cursor-pointer ${isOpen ? 'z-20' : 'z-10'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Pasamos el estado 'isOpen' al hijo para que pueda reaccionar */}
      {children(isOpen)}
      
      {/* El contenido del menú se muestra basado en el estado 'isOpen' */}
      {menuContent && (
        <div
          className={`
            absolute top-full left-1/2 -translate-x-1/2 mt-4
            transition-all duration-200 ease-in-out
            ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
          `}
        >
          {menuContent}
        </div>
      )}
    </div>
  );
};

export default HoverMenuItem;