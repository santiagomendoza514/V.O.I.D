import React from 'react';
import FlippableCard from './FlippableCard';

const cardData = [
  {
    title: 'Tops',
    menuItems: ['View All', 'Chaquetas', 'Sacos', 'Hoddies', 'Camisetas'],
    backgroundImage: '/tops1.jpeg',
  },
  {
    title: 'Bottoms',
    menuItems: ['View All', 'Sudaderas', 'Rompevientos', 'Pantalones', 'Jorts'],
    backgroundImage: '/bottoms1.jpeg', 
  },
  {
    title: 'Accessories',
    menuItems: ['View All', 'Tote Bags', 'Bolsos', 'Gorras', 'Boinas'],
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