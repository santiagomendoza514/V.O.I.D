import Header from "@/components/layout/Header";
import Hero from "@/components/Hero";
import CategoryCards from "@/components/CategoryCards"; 

export default function HomePage() {
  return (
    
    <div>
      <Header />
      <Hero />
      <CategoryCards />
      
      
      <div className="h-screen bg-gray-100 relative z-10">
        <h2 className="text-center text-3xl pt-12 text-black">Más Contenido Aquí</h2>
      </div>
    </div>
  );
}