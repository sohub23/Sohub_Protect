import heroImage from "@/assets/protect hero.jpeg";
import comHeroImage from "@/assets/com hero.png";
import shieldBadge from "@/assets/shield-badge.png";
import { ShoppingBag } from "lucide-react";
import CompatibilityIcons from "./CompatibilityIcons";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* Mobile version - shows both camera and panel */}
        <img
          src={heroImage}
          alt="আপনার ঘর, আপনার শান্তি"
          className="md:hidden w-full h-full object-cover"
          style={{ objectPosition: '60% center' }} />

        {/* Desktop version - shows com hero image */}
        <img
          src={comHeroImage}
          alt="আপনার ঘর, আপনার শান্তি"
          className="hidden md:block w-full h-full object-cover object-center" />

        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-32">
        <div className="max-w-xl">
          <img
            src={shieldBadge}
            alt="SOHUB Protect"
            className="h-12 md:h-20 mb-6 md:mb-8 opacity-0 animate-fade-in scale-[1.3] origin-left md:scale-100"
            style={{ animationDelay: "0.2s" }} />

          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-none mb-2 md:mb-3">
              মিথ্যা !
            </h1>
            <p className="text-lg md:text-2xl lg:text-3xl font-medium text-primary-foreground/90 mb-6 md:mb-8">
              কে বলেছে আপনার সম্পদ নিরাপদ নয়?
            </p>
          </div>

          <p
            className="text-sm md:text-lg text-primary-foreground/80 mb-8 md:mb-10 max-w-md opacity-0 animate-fade-in-up leading-relaxed"
            style={{ animationDelay: "0.7s" }}>যেখানে আপনার সম্পদের সুরক্ষা নিশ্চিত করা হয় সর্বোচ্চ প্রযুক্তি দিয়ে। সার্বক্ষনিক যেকোনো জায়গা থেকে জানা যাবে কি ঘটছে।
          </p>

          <div
            className="flex flex-row items-center justify-start gap-2 md:gap-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1s" }}>

            <a
              href="#order"
              className="w-auto flex items-center justify-center gap-1.5 bg-primary-foreground text-primary px-4 md:px-10 py-2 md:py-3.5 rounded-full font-bold text-[11px] md:text-base hover:bg-primary-foreground/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <ShoppingBag className="w-3 h-3 md:w-5 md:h-5" />
              অর্ডার করুন
            </a>

            <a
              href="#how"
              className="w-auto border border-primary-foreground/30 text-primary-foreground px-4 md:px-10 py-2 md:py-3.5 rounded-full font-medium text-[11px] md:text-base hover:bg-primary-foreground/10 transition-colors text-center shadow-lg whitespace-nowrap"
            >
              কিভাবে কাজ করে
            </a>
          </div>

          {/* Pricing Badge */}
          <div
            className="inline-flex flex-col mt-8 md:mt-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.2s" }}>

            <span className="text-[10px] md:text-xs text-primary-foreground font-medium tracking-wide mb-3 md:mb-4">
              Secure Your Peace of Mind
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-primary-foreground/60">From</span>
                <span className="text-lg md:text-xl font-bold text-primary-foreground">7,490 BDT</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-primary-foreground/70">
                <span>Free Delivery</span>
                <span className="text-primary-foreground/40">•</span>
                <span>European Standard Hardware</span>
                <span className="text-primary-foreground/40">•</span>
                <span>No Monthly Fee</span>
              </div>
            </div>
          </div>

          {/* Compatibility badges with icons */}
          <div
            className="mt-8 md:mt-12 opacity-0 animate-fade-in"
            style={{ animationDelay: "1.3s" }}>
            <CompatibilityIcons variant="light" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
