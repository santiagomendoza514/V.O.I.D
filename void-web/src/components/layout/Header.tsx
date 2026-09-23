"use client"; // Directiva necesaria para usar hooks como useState

import React, { useState, useEffect, useRef  } from 'react';
import Navbar from './Navbar';

const HIDE_AFTER = 120; // px desde arriba antes de permitir que se oculte
const DELTA = 8;        // px mínimos de movimiento para reaccionar

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const lastY = useRef(0);
  const ticking = useRef(false);
  const hovering = useRef(false);

useEffect(() => {
    lastY.current = Math.max(0, window.scrollY);

    const update = () => {
      const y = Math.max(0, window.scrollY); // clamp del rebote de iOS
      const diff = y - lastY.current;

      setIsScrolled(y > 1);

      if (Math.abs(diff) >= DELTA) {
        if (y < HIDE_AFTER || hovering.current) {
          setIsHidden(false);          // cerca del top o con el cursor encima: siempre visible
        } else {
          setIsHidden(diff > 0);       // bajando oculta, subiendo muestra
        }
        lastY.current = y;             // solo se actualiza al superar el umbral
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 pt-8
                  transition-transform duration-500 ease-out will-change-transform
                  ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
      onMouseEnter={() => {
        hovering.current = true;
        setIsNavVisible(true);
      }}
      onMouseLeave={() => {
        hovering.current = false;
        setIsNavVisible(false);
      }}
    >
      <Navbar isNavVisible={isNavVisible} isScrolled={isScrolled} />
    </header>
  );
};

export default Header;