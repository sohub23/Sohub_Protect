import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import YouTubeCarousel from "@/components/YouTubeCarousel";
import HowItWorksSection from "@/components/HowItWorksSection";
import PackagesSection from "@/components/PackagesSection";
import AddonsSection from "@/components/AddonsSection";
import FeaturesSection from "@/components/FeaturesSection";
import OrderSection from "@/components/OrderSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <YouTubeCarousel />
      <HowItWorksSection />
      <PackagesSection />
      <AddonsSection />
      <FeaturesSection />
      <OrderSection />
      <ContactSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
