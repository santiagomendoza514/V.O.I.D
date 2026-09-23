"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BorderGlow from './BorderGlow';

interface FlippableCardProps {
  title: string;
  menuItems: string[];
  backgroundImage: string;
}

const FlippableCard = ({ title, menuItems, backgroundImage }: FlippableCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [glowKey, setGlowKey] = useState(0);

  const handleHoverStart = () => setIsFlipped(true);
  const handleHoverEnd = () => setIsFlipped(false);

  return (
    <div
      className="w-[370px] h-[450px] rounded-lg [perspective:1000px]"
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d]"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onAnimationComplete={() => {
          if (isFlipped) setGlowKey((k) => k + 1); 
        }}
      >
        {/* Cara Frontal */}
        <div
          className="absolute w-full h-full bg-cover bg-center rounded-lg [backface-visibility:hidden] flex flex-col justify-end p-6"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
          <h3 className="text-white text-4xl font-bold uppercase relative z-10 text-center justify-center">{title}</h3>
        </div>

        {/* Cara Trasera */}
        <div
          className="absolute w-full h-full inset-0 rounded-lg [backface-visibility:hidden] [transform:rotateX(180deg)]"
          >
          <BorderGlow
            key={glowKey}
            edgeSensitivity={50}
            glowColor="40 80% 80%"
            backgroundColor="#000000"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1.5}
            coneSpread={45}
            animated
            colors={['#F20D20', '#F20D20', '#F20D20']}
            className="w-full h-full"
          >
            <div className="w-full h-full rounded-lg flex flex-col items-center justify-center p-6">
              <div className="flex flex-col items-center space-y-3" >
                {menuItems.map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="relative text-white uppercase transition-all duration-300
                  hover:font-bold hover:translate-x-3
                  before:content-['➣'] before:right-full before:mr-2 
                  before:top-1/2 before:-translate-y-1/2
                  before:opacity-0 hover:before:opacity-100 
                  before:transition-opacity before:duration-300
                  after:content-[attr(data-text)] after:block after:h-0 after:font-bold
                  after:overflow-hidden after:invisible after:pointer-events-none"
                >
                  {item}
                </a>
            ))}
          </div>
        </div>
        </BorderGlow>
        </div> 

      </motion.div>
    </div>
  );
};

export default FlippableCard;