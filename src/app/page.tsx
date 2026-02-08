import Hero from "@/components/Hero";
import Squad from "@/components/Squad";
import FlightDashboard from "@/components/FlightDashboard";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Squad />
      <FlightDashboard />
      <VideoSection />
      <Footer />
    </main>
  );
}
