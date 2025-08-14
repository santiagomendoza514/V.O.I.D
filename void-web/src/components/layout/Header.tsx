"use client"; // Directiva necesaria para usar hooks como useState

import React, { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';

const Header = () => {
  // Este estado controlará la visibilidad y animación de la Navbar
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <header
      onMouseEnter={() => setIsNavVisible(true)}
      onMouseLeave={() => setIsNavVisible(false)}
      className="fixed top-0 left-0 w-full z-50"
    >
      <AnnouncementBar />
      <Navbar isNavVisible={isNavVisible} />
    </header>
  );
};

export default Header;