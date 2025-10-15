import React from 'react';
import FlippableCard from './FlippableCard';

const cardData = [
  {
    title: 'Tote Bags',
    menuItems: ['View All', 'Tops', 'Bottoms', 'Dresses', 'Accessories'],
    backgroundImage: '/hero-background.jpg', // Reemplaza con tus imágenes
  },
  {
    title: 'Sweatpants',
    menuItems: ['View All', 'T-Shirts', 'Pants', 'Hoodies', 'Accessories'],
    backgroundImage: '/hero-background.jpg', // Reemplaza con tus imágenes
  },
  {
    title: 'Others',
    menuItems: ['View All', 'Unisex', 'Limited Edition', 'Collaborations'],
    backgroundImage: '/hero-background.jpg', // Reemplaza con tus imágenes
  },
];

const CategoryCards = () => {
  return (
    <section className="bg-white py-10">
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