import React from 'react';

const Hero = () => {
  return (
    <section
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      {/*
        Este contenedor es un buen lugar para añadir texto o botones
        que quieras superponer sobre la imagen del hero, por ejemplo:
        <div className="flex h-full items-center justify-center">
          <h1 className="text-white text-5xl">V.O.I.D</h1>
        </div>
      */}
    </section>
  );
};

export default Hero;