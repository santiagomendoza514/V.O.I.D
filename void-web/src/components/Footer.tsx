"use client"; // 1. Hacemos el componente interactivo para la función de scroll

import React from "react";
import { Facebook, Instagram, Youtube, ArrowUp } from "lucide-react";
// Asumimos iconos para TikTok y WhatsApp. Si no existen, se pueden usar SVGs directamente.
// import { TikTokIcon, WhatsAppIcon } from './CustomIcons'; 

const Footer = () => {
  // 2. Función para hacer scroll suave hacia la parte superior de la página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* === FILA SUPERIOR: MÉTODOS DE PAGO Y REDES SOCIALES === */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-15 gap-8 md:gap-0">
          {/* Métodos de pago - Izquierda */}
          <div className="flex items-center gap-4">
            {/* Reemplaza 'src' con la ruta a tus SVGs en la carpeta /public */}
            <img src="/visa.png" alt="Visa" className="h-8" />
            <img src="/master.png" alt="Mastercard" className="h-8" />
            <img src="/paypal.png" alt="PayPal" className="h-8" />
            <img src="/bancolombia.png" alt="Bancolombia" className="h-8" />
            <img src="/mercado-pago-.png" alt="Mercado Pago" className="h-8" />
            <img src="/nequi.png" alt="Nequi" className="h-8" />
            <img src="/pse.jpg" alt="PSE" className="h-8" />
          </div>

          {/* Redes Sociales - Derecha */}
          <div className="flex items-center gap-6">
            <a href="#" aria-label="Facebook" className="hover:text-gray-400 transition-colors"><Facebook size={24} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-400 transition-colors"><Instagram size={24} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-gray-400 transition-colors"><Youtube size={24} /></a>
            {/* Para TikTok y WhatsApp, necesitarías SVGs o una librería que los incluya */}
            {/* <a href="#" aria-label="TikTok"><TikTokIcon /></a> */}
            {/* <a href="#" aria-label="WhatsApp"><WhatsAppIcon /></a> */}
          </div>
        </div>

        {/* === SECCIÓN MEDIA: 4 COLUMNAS DE INFORMACIÓN === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Columna 1: V.O.I.D */}
          <div className="flex flex-col">
            <h3 className="font-bold uppercase tracking-wider mb-4">V.O.I.D</h3>
            <p className="text-gray-400 mb-2">Dirección: Calle Falsa 123</p>
            <p className="text-gray-400 mb-2">E-mail: contacto@void.com</p>
            <p className="text-gray-400 mb-2">Teléfono: +57 300 123 4567</p>
            <p className="text-gray-400">Bogotá, Colombia</p>
          </div>

          {/* Columna 2: Información */}
          <div className="flex flex-col">
            <h3 className="font-bold uppercase tracking-wider mb-4">Información</h3>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mb-2">About us</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mb-2">Contacto</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Preguntas frecuentes</a>
          </div>

          {/* Columna 3: Políticas */}
          <div className="flex flex-col">
            <h3 className="font-bold uppercase tracking-wider mb-4">Políticas</h3>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mb-2">Terms and conditions</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mb-2">Política de privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mb-2">Política de cookies</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors mb-2">Política de compra</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de reembolso</a>
          </div>

          {/* Columna 4: Únete a V.O.I.D */}
          <div className="flex flex-col">
            <h3 className="font-bold uppercase tracking-wider mb-4">Únete a V.O.I.D</h3>
            <p className="text-gray-400 mb-4">Recibe ofertas exclusivas y las últimas noticias.</p>
            <form className="flex flex-col md:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white flex-grow"
              />
              <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* === LÍNEA DE SEPARACIÓN === */}
        <div className="w-11/12 mx-auto border-t border-white-700 mb-8"></div>

        {/* === FILA INFERIOR: COPYRIGHT Y FLECHA PARA SUBIR === */}
        <div className="flex justify-between items-center">
          {/* Copyright y Eslogan - Centrado (con un espaciador a la izquierda) */}
          <div className="flex-1"></div> {/* Espaciador */}
          <div className="flex-1 text-center text-gray-500 text-sm">
            <p>© 2025 V.O.I.D. Todos los derechos reservados.</p>
            <p className="italic">☸DEL VACÍO SE CREA TODO☸</p>
          </div>
          
          {/* Flecha para subir - Derecha */}
          <div className="flex-1 flex justify-end">
            <button 
              onClick={scrollToTop} 
              aria-label="Volver arriba"
              className="w-12 h-12 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <ArrowUp size={35} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;