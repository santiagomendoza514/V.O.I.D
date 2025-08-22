"use client";

import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Establece el tamaño inicial y escucha los cambios
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Limpia el listener al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}