"use client"; // Directiva necesaria para usar hooks como useState

import React, { useState, useEffect  } from 'react';
import Navbar from './Navbar';
import AnnouncementBar from './AnnouncementBar';

const Header = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // CAMBIO CLAVE: La posición cambia con el scroll
    <header
      className={`left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'fixed top-0' : 'absolute top-0'
      }`}
      onMouseEnter={() => setIsNavVisible(true)}
      onMouseLeave={() => setIsNavVisible(false)}
    >
      <AnnouncementBar />
      <Navbar isNavVisible={isNavVisible} isScrolled={isScrolled} />
    </header>
  );
};

export default Header;