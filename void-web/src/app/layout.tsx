import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/Header'; // Asegúrate que la ruta sea correcta

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const fuenteannouncementbar = localFont({
  src: '../fonts/Blox2.woff2', // Ruta al archivo de tu fuente
  display: 'swap',
  variable: '--font-void-custom', // Nombre de la variable CSS que crearemos
});

export const metadata: Metadata = {
  title: 'V.O.I.D',
  description: 'Del vacio se crea todo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${fuenteannouncementbar.variable} font-sans`}>
        <Header /> {/* <-- AÑADIMOS NUESTRO HEADER AQUÍ */}
        <main className="pt-24"> {/* Añadimos padding-top para que el contenido no quede debajo del header fijo */}
          {children}
        </main>
      </body>
    </html>
  );
}