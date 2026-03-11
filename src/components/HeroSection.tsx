import heroImage from "@/assets/hero-living-room.jpg";
import shieldBadge from "@/assets/shield-badge.png";
import CompatibilityIcons from "./CompatibilityIcons";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="আপনার ঘর, আপনার শান্তি"
          className="w-full h-full object-cover" />
        
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-32">
        <div className="max-w-xl">
          <img
            src={shieldBadge}
            alt="SOHUB Protect"
            className="h-16 md:h-20 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }} />
          
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-none mb-3">
              মিথ্যা !
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-medium text-primary-foreground/90 mb-8">
              কে বলেছে আপনার সম্পদ নিরাপদ নয়?
            </p>
          </div>

          <p
            className="text-lg text-primary-foreground/80 mb-10 max-w-md opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}>যেখানে আপনার সম্পদের সুরক্ষা নিশ্চিত করা হয় সর্বোচ্চ প্রযুক্তি দিয়ে। সার্বক্ষনিক যেকোনো জায়গা থেকে জানা যাবে কি ঘটছে।
          </p>
          <div
            className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "1s" }}>
            
            <a
              href="#packages"
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium text-base hover:bg-brand-dark transition-colors">
              প্যাকেজ দেখুন
            </a>
            <a
              href="#how"
              className="border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-full font-medium text-base hover:bg-primary-foreground/10 transition-colors">
              কিভাবে কাজ করে
            </a>
          </div>

          {/* Compatibility badges with icons */}
          <div
            className="mt-12 opacity-0 animate-fade-in"
            style={{ animationDelay: "1.3s" }}>
            <CompatibilityIcons variant="light" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
