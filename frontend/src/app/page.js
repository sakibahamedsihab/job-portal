import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex flex-col items-center w-full">
        <HeroSection />
        <FeaturedJobs />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
