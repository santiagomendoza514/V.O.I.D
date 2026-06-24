"use client"; // Directiva necesaria para usar hooks como useState

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Navbar from './Navbar';
//import AnnouncementBar from './AnnouncementBar';
import CurvedLoop from './CurvedLoop';


const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const curvedRef = useRef<HTMLDivElement>(null);
  const [curvedHeight, setCurvedHeight] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (curvedRef.current) setCurvedHeight(curvedRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);


useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const scrolled = y > 1;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll,  {passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // CAMBIO CLAVE: La posición cambia con el scroll
    <header className="fixed top-0 left-0 w-full z-50"
      onMouseEnter={() => setIsNavVisible(true)}
      onMouseLeave={() => setIsNavVisible(false)}
    >

      <div
        className="transition-transform duration-500 ease-in-out will-change-transform"
        style={{
          transform: isScrolled ? `translateY(-${curvedHeight}px)` : 'translateY(0)',
        }}
      >

        <div ref={curvedRef}>
          <CurvedLoop marqueeText=" DEL VACÍO SE CREA TODO ☸"/>
        </div>

        
            
      
      {/*<AnnouncementBar />*/}
    


      <Navbar isNavVisible={isNavVisible} isScrolled={isScrolled} />

      </div>
    </header>
  );
};

export default Header;