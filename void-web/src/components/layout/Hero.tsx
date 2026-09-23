"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const SLIDES = [
  { src: '/hero1.jpeg', alt: 'Colección nueva temporada' },
  { src: '/hero2.jpeg', alt: 'Abrigos y prendas de exterior' },
  { src: '/hero3.jpeg', alt: 'Básicos en burda' },
  { src: '/hero4.jpeg', alt: 'Accesorios y complementos' },
  { src: '/hero5.jpeg', alt: 'Nuevos lanzaminetos!' },
];

const HOLD = 4000;   // ms que cada imagen permanece fija
const FADE = 1.4;    // s que dura el fundido cruzado

const Hero = () => {

  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const reduceMotion = useReducedMotion();

  const fade = reduceMotion ? 0.3 : FADE;
  const zoomFrom = reduceMotion ? 1 : 1.1;

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, HOLD);
    return () => clearTimeout(id);
  }, [index]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-neutral-900">
      {SLIDES.map((slide, i) => {
        const isActive = i === index;

        return (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            style={{ zIndex: isActive ? 1 : 0 }}
            initial={{ opacity: i === 0 ? 1 : 0, scale: zoomFrom }}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : zoomFrom,
            }}
            transition={
              isActive
                ? {
                    opacity: { duration: fade, ease: [0.4, 0, 0.2, 1] },
                    scale: { duration: HOLD / 1000 + fade, ease: 'linear' },
                  }
                : { duration: 0, delay: fade + 0.2 }
            }
          >
            {(i === 0 || hydrated) && (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            )}
          </motion.div>
        );
      })}

      {/* Velo para que el texto sea legible sobre cualquier foto */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

      {/* Tu contenido */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* titular, subtítulo, CTA */}
      </div>

      {/* Indicadores minimalistas (opcional) */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-4">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setIndex(i)}
            aria-label={`Ver imagen ${i + 1} de ${SLIDES.length}`}
            className="group py-3"
          >
            <span
              className={`block h-px w-10 transition-all duration-500 ${
                i === index ? 'bg-white' : 'bg-white/40 group-hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;