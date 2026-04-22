import Hero from "@/components/Hero";
import Squad from "@/components/Squad";
import FlightDashboard from "@/components/FlightDashboard";
import Itinerary from "@/components/Itinerary";
import LocationSection from "@/components/LocationSection";
import VideoSection from "@/components/VideoSection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Squad />
      <FlightDashboard />
      <Itinerary />
      <LocationSection />
      <VideoSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
