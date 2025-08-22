"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface SparkleEffectProps {
  children: React.ReactNode;
  color?: string;
  sparkleCount?: number;
  size?: number;
  animationSpeed?: number;
}


// Componente para una sola estrella/brillo
const Sparkle = ({ size, color, top, left, delay, speed }) => (
  <motion.div
    className="absolute"
    style={{ top, left }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0],
    }}
    transition={{
      delay,
      duration: speed,
      repeat: Infinity,
      repeatDelay: 2, // Tiempo de espera antes de repetir
    }}
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill={color}>
      <path d="M16.345,1.284c0,5.89526-.14178,9.44806-1.33972,11.5929-2.36371-.66962-4.97614-3.08155-9.14472-7.25013,4.16858,4.16858,6.58051,6.781,7.25013,9.14472-2.14484,1.19794-5.69764,1.33972-11.5929,1.33972,5.89526,0,9.44806.14172,11.5929,1.33966-.66962,2.36371-3.08155,4.97614-7.25013,9.14472,4.16858-4.16858,6.78107-6.58051,9.14478-7.25007,1.19794,2.14484,1.33966,5.69764,1.33966,11.5929,0-5.89526.14172-9.44806,1.33966-11.5929,2.36371.66956,4.9762,3.08149,9.14478,7.25007-4.16858-4.16858-6.58051-6.781-7.25013-9.14472,2.14484-1.19794,5.69764-1.33966,11.5929-1.33966-5.89526,0-9.44806-.14178-11.5929-1.33972.66962-2.36371,3.08155-4.97614,7.25013-9.14472-4.16858,4.16858-6.781,6.58051-9.14472,7.25013C16.48676,10.73208,16.345,7.17928,16.345,1.284ZM26.82942,5.62679h0Z" />
    </svg>
    
  </motion.div>
);

// Componente principal que genera múltiples brillos
const SparkleEffect = ({ children, color = '#FFD700',  sparkleCount = 15, size = 10, animationSpeed = 1.5,}) => {
  // Generamos un array de 15 brillos con posiciones y retrasos aleatorios
  const sparkles = Array.from({ length: sparkleCount }).map((_, i) => {
    const top = `${Math.random() * 120 - 10}%`; // De -10% a 110% para cubrir los bordes
    const left = `${Math.random() * 120 - 10}%`;
    const delay = Math.random() * 3; // Retraso aleatorio para que no aparezcan todos a la vez
    return <Sparkle key={i} size={size} color={color} top={top} left={left} delay={delay} speed={animationSpeed} />;
  });

  return (
    <div className="relative inline-block">
      {sparkles}
      {children}
    </div>
  );
};

export default SparkleEffect;