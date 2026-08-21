import Hero from "@/components/sections/hero";
import Feature from "@/components/sections/feature";
import Cta from "@/components/sections/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col bg-black text-white">
      <Hero />
      <Feature />
      <Cta />
      <Footer />
    </main>
  );
}
