import Hero from "@/components/sections/hero";
import Feature from "@/components/sections/feature";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 bg-[#0A0A0B] text-white">
      <Hero />
      <Feature />
    </main>
  );
}
