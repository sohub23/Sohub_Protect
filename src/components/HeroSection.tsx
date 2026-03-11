import heroImage from "@/assets/protect hero.jpeg";
import shieldBadge from "@/assets/shield-badge.png";
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
        
        {/* Desktop version - shows full image */}
        <img
          src={heroImage}
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
            className="h-12 md:h-20 mb-6 md:mb-8 opacity-0 animate-fade-in"
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
            className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1s" }}>
            
            <a
              href="#packages"
              className="bg-primary text-primary-foreground px-6 md:px-8 py-3 md:py-3.5 rounded-full font-medium text-sm md:text-base hover:bg-brand-dark transition-colors text-center">
              প্যাকেজ দেখুন
            </a>
            <a
              href="#how"
              className="border border-primary-foreground/30 text-primary-foreground px-6 md:px-8 py-3 md:py-3.5 rounded-full font-medium text-sm md:text-base hover:bg-primary-foreground/10 transition-colors text-center">
              কিভাবে কাজ করে
            </a>
          </div>

          {/* Pricing Badge */}
          <div
            className="inline-flex flex-col gap-2 mt-6 md:mt-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1.2s" }}>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-primary-foreground/60">From</span>
                <span className="text-lg md:text-xl font-bold text-primary-foreground">7,490 BDT</span>
              </div>
              <span className="text-primary-foreground/40">|</span>
              <span className="text-xs md:text-sm text-primary-foreground/70">FREE Support • 1-Year Warranty</span>
            </div>
            <span className="text-[10px] md:text-xs text-primary tracking-wide">#SecureYourPeaceOfMind</span>
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
