import React from 'react';
import FlippableCard, { type ItemMenu } from './FlippableCard';
import { PARTES, enlaceColeccion } from '@/lib/enlaces';

// Las categorías sin `href` todavía no tienen prendas: se muestran como
// "próximamente" en vez de llevar a una colección vacía.
const cardData: { title: string; menuItems: ItemMenu[]; backgroundImage: string }[] = [
  {
    title: 'Tops',
    menuItems: [
      { etiqueta: 'View All', href: enlaceColeccion({ tipo: PARTES.tops }) },
      { etiqueta: 'Chaquetas', href: enlaceColeccion({ tipo: ['chaqueta'] }) },
      { etiqueta: 'Sacos', href: enlaceColeccion({ tipo: ['saco'] }) },
      { etiqueta: 'Hoodies', href: enlaceColeccion({ tipo: ['hoodie'] }) },
      { etiqueta: 'Camisetas', href: enlaceColeccion({ tipo: ['camiseta'] }) },
    ],
    backgroundImage: '/tops1.jpeg',
  },
  {
    title: 'Bottoms',
    menuItems: [
      { etiqueta: 'View All', href: enlaceColeccion({ tipo: PARTES.bottoms }) },
      { etiqueta: 'Sudaderas', href: enlaceColeccion({ tipo: ['sudadera'] }) },
      { etiqueta: 'Rompevientos' },
      { etiqueta: 'Pantalones', href: enlaceColeccion({ tipo: ['pantalon'] }) },
      { etiqueta: 'Jorts' },
    ],
    backgroundImage: '/bottoms1.jpeg',
  },
  {
    title: 'Accessories',
    menuItems: [
      { etiqueta: 'View All', href: enlaceColeccion({ tipo: PARTES.accesorios }) },
      { etiqueta: 'Tote Bags', href: enlaceColeccion({ tipo: ['tote'] }) },
      // Una tote bag es un bolso: por ahora llevan al mismo sitio.
      { etiqueta: 'Bolsos', href: enlaceColeccion({ tipo: ['tote'] }) },
      { etiqueta: 'Gorras' },
      { etiqueta: 'Boinas' },
    ],
    backgroundImage: '/accessories2.jpeg',
  },
];

const CategoryCards = () => {
  return (
    <section className="bg-[#F9F6EE] py-10">
      <div className="container mx-auto flex justify-center items-center gap-8">
        {cardData.map((card) => (
          <FlippableCard
            key={card.title}
            title={card.title}
            menuItems={card.menuItems}
            backgroundImage={card.backgroundImage}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
