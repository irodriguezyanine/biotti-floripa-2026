import Hero from "@/components/Hero";
import Squad from "@/components/Squad";
import FlightDashboard from "@/components/FlightDashboard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Squad />
      <FlightDashboard />
      <Footer />
    </main>
  );
}
