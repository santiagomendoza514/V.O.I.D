import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';
import PreviewCascara from '@/components/PreviewCascara';

/**
 * Cáscara V.O.I.D: lo que no cambia entre las siete colecciones. El padding
 * superior deja pasar el header, que va fijo sobre el contenido.
 */
export default function LayoutColecciones({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--void-fondo)] text-[var(--void-tinta)]">
      <Header />
      <main className="pt-32 md:pt-44">{children}</main>
      <Footer />
      <PreviewCascara />
    </div>
  );
}
