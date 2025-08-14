import React from 'react';

const AnnouncementBar = () => {
  const announcementText = "ENVÍOS GRATIS EN PEDIDOS SUPERIORES A 50€";

  return (
    <div className="bg-black text-white text-xs font-custom overflow-hidden  whitespace-nowrap ">
      <div className="inline-block animate-[marquee_15s_linear_infinite]">
        {/* Duplicamos el texto para un bucle perfecto */}
        <span className="mx-4">{announcementText}</span>
        <span className="mx-4">{announcementText}</span>
        <span className="mx-4">{announcementText}</span>
      </div>
      <div className="inline-block animate-[marquee_15s_linear_infinite]">
        {/* Lo duplicamos una vez más por si el viewport es muy ancho */}
        <span className="mx-4">{announcementText}</span>
        <span className="mx-4">{announcementText}</span>
        <span className="mx-4">{announcementText}</span>
      </div>
      <div className="inline-block animate-[marquee_15s_linear_infinite]">
        {/* Lo duplicamos una vez más por si el viewport es muy ancho */}
        <span className="mx-4">{announcementText}</span>
        <span className="mx-4">{announcementText}</span>
        <span className="mx-4">{announcementText}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;