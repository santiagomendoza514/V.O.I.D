import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * Cáscara V.O.I.D: lo que no cambia entre las siete colecciones. El padding
 * superior deja pasar el header, que va fijo sobre el contenido.
 */
export default function LayoutColecciones({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--void-fondo)] text-[var(--void-tinta)]">
      <Header />
      {/* Sin padding aquí: cada página reserva el espacio del encabezado fijo con
          su propio fondo. Si lo pusiera este layout, quedaría pintado con el
          oscuro de la cáscara, aunque la colección sea blanca. */}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
