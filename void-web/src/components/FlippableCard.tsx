"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlippableCardProps {
  title: string;
  menuItems: string[];
  backgroundImage: string;
}

const FlippableCard = ({ title, menuItems, backgroundImage }: FlippableCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleHoverStart = () => setIsFlipped(true);
  const handleHoverEnd = () => setIsFlipped(false);

  return (
    <div
      className="w-[350px] h-[450px] rounded-lg [perspective:1000px]"
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Cara Frontal */}
        <div
          className="absolute w-full h-full bg-cover bg-center rounded-lg [backface-visibility:hidden] flex flex-col justify-end p-6"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
          <h3 className="text-white text-5xl font-bold uppercase relative z-10 text-center">{title}</h3>
        </div>

        {/* Cara Trasera */}
        <div
          className="absolute w-full h-full bg-white rounded-lg [backface-visibility:hidden] [transform:rotateX(180deg)] flex flex-col items-center justify-center p-6"
        >
          <div className="flex flex-col space-y-3 text-center">
            {menuItems.map((item) => (
              <a 
                key={item} 
                href="#" 
                className="relative text-black uppercase tracking-wider hover:font-bold hover:translate-x-3 transition-all duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlippableCard;