import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import YouTubeCarousel from "@/components/YouTubeCarousel";
import HowItWorksSection from "@/components/HowItWorksSection";
import PackagesSection from "@/components/PackagesSection";
import AddonsSection from "@/components/AddonsSection";
import FeaturesSection from "@/components/FeaturesSection";
import OrderSection from "@/components/OrderSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import OurInitiatives from "@/components/OurInitiatives";
import Footer from "@/components/Footer";

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "SOHUB Protect";
    const payment = searchParams.get("payment");
    const status = searchParams.get("status");
    const paymentID = searchParams.get("paymentID");
    const tranId = searchParams.get("tran_id");

    if (payment && status) {
      // Clear search params after reading
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("payment");
      newParams.delete("status");
      newParams.delete("paymentID");
      newParams.delete("tran_id");
      newParams.delete("val_id");
      setSearchParams(newParams, { replace: true });

      if (status === "success") {
        toast.success("Payment Successful!", {
          description: tranId ? `Order: ${tranId}` : "Your order is being processed.",
        });
        sessionStorage.removeItem('pending_order');
      }
 else if (status === "cancel") {
        toast.info("Payment Cancelled", {
          description: "You can try again or choose another method.",
        });
      } else {
        toast.error("Payment Failed", {
          description: "Please check your details and try again.",
        });
      }
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <YouTubeCarousel />
      <SolutionSection />
      <PackagesSection />
      <AddonsSection />
      <FeaturesSection />
      <OrderSection />
      <FAQSection />
      <OurInitiatives />
      <Footer />
    </div>
  );
};

export default Index;
