import React from 'react';

const AnnouncementBar = () => {
  const announcementText = "▶DEL VACÍO SE CREA TODO◀";

  return (
    <div className="announcement-bar">
      <div className="announcement-bar__content">
        {/* Duplicamos el texto para un bucle perfecto */}
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
      </div>
      <div className="announcement-bar__content">
        {/* Lo duplicamos una vez más por si el viewport es muy ancho */}
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
        <span className="announcement-bar__text mx-4">{announcementText}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;