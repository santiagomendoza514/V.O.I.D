import Header from "@/components/layout/Header";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    
    <div>
      <Header />
      <Hero />
      
      
      <div className="h-screen bg-gray-100 relative z-10">
        <h2 className="text-center text-3xl pt-12 text-black">Más Contenido Aquí</h2>
      </div>
    </div>
  );
}