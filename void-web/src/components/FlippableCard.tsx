"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BorderGlow from './BorderGlow';

/** Sin `href`: la categoría existe en el menú pero aún no tiene prendas. */
export interface ItemMenu {
  etiqueta: string;
  href?: string;
}

interface FlippableCardProps {
  title: string;
  menuItems: ItemMenu[];
  backgroundImage: string;
}

const ITEM_BASE =
  "relative uppercase transition-all duration-300 before:content-['➣'] before:right-full before:mr-2 " +
  'before:top-1/2 before:-translate-y-1/2 before:opacity-0 before:transition-opacity before:duration-300';

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
                {menuItems.map((item) =>
                  item.href ? (
                    <Link
                      key={item.etiqueta}
                      href={item.href}
                      className={`${ITEM_BASE} text-white hover:translate-x-3 hover:font-bold hover:before:opacity-100 focus-visible:translate-x-3 focus-visible:font-bold focus-visible:outline-none focus-visible:before:opacity-100`}
                    >
                      {item.etiqueta}
                    </Link>
                  ) : (
                    <span
                      key={item.etiqueta}
                      aria-disabled="true"
                      title="Próximamente"
                      className={`${ITEM_BASE} cursor-not-allowed text-white/45 hover:line-through`}
                    >
                      {item.etiqueta}
                    </span>
                  )
                )}
          </div>
        </div>
        </BorderGlow>
        </div> 

      </motion.div>
    </div>
  );
};

export default FlippableCard;