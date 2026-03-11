import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Package, Tag, ListChecks, Wrench, HeadphonesIcon, TrendingUp, Award, Shield, Smartphone, Zap, Home } from "lucide-react";

import partnershipBundled from "@/assets/partnership-bundled.png";
import partnershipValue from "@/assets/partnership-value.png";
import partnershipCollab from "@/assets/partnership-collab.png";

const partnershipWays = [
  {
    icon: Package,
    title: "Bundled Packages",
    description: "Real estate developers offer homes with pre-installed smart home security systems as part of the purchase package.",
  },
  {
    icon: Tag,
    title: "Promotional Offers",
    description: "Real estate companies collaborate with SOHUB Protect to offer discounts or special promotions on smart home security systems for new homeowners.",
  },
  {
    icon: ListChecks,
    title: "Enhanced Property Listings",
    description: "Properties equipped with smart home technology are highlighted in listings, emphasizing their modern and secure features to attract tech-savvy buyers.",
  },
  {
    icon: Wrench,
    title: "Installation & Maintenance",
    description: "SOHUB Protect provides installation services and ongoing maintenance, ensuring that the systems are always operational and up-to-date.",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    description: "Homebuyers receive dedicated personalized support from SOHUB Protect, enhancing their overall experience and satisfaction with the property.",
  },
];

const realEstateBenefits = [
  {
    icon: TrendingUp,
    title: "Increased Property Value",
    description: "Homes with integrated smart security systems can command higher prices and attract more buyers.",
  },
  {
    icon: Award,
    title: "Differentiation in the Market",
    description: "Offering advanced security features helps real estate companies differentiate their properties from competitors.",
  },
  {
    icon: Building2,
    title: "Enhanced Reputation",
    description: "Partnering with reputable SOHUB Protect boosts the real estate company's credibility and trustworthiness.",
  },
];

const homebuyerBenefits = [
  {
    icon: Shield,
    title: "Enhanced Security",
    description: "Homebuyers gain peace of mind knowing their property is protected by advanced security systems.",
  },
  {
    icon: Smartphone,
    title: "Convenience & Control",
    description: "Smart home systems offer convenience through remote monitoring and control via mobile apps.",
  },
  {
    icon: Zap,
    title: "Future-Proof Homes",
    description: "Investing in smart security systems ensures the property remains relevant and up-to-date with the latest technology trends.",
  },
];

const successStories = [
  {
    company: "Lennar & Ring",
    description: "Lennar, a major homebuilder, partnered with Ring to integrate Ring's security products into their new homes, providing a comprehensive smart home experience.",
  },
  {
    company: "ADT & Realogy",
    description: "Realogy, a real estate services company, partnered with ADT to offer their customers ADT's security solutions, enhancing the appeal and safety of their properties.",
  },
];

const Partnership = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative h-[420px] md:h-[500px] overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent/80">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[length:30px_30px]" />
          <div className="absolute inset-0 flex items-center">
            <div className="section-container">
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground max-w-2xl leading-tight">
                Real Estate & SOHUB Protect Partnership
              </h1>
              <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-xl">
                In developed countries, real estate companies partner with smart home security providers to enhance property appeal and provide added value to homebuyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Partnerships Work */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-in">
              Partnership Model
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Common Ways These Partnerships Work
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <img
                src={partnershipBundled}
                alt="Bundled Smart Home Package"
                className="w-full max-w-sm hover-scale"
              />
            </div>
            <div className="space-y-6">
              {partnershipWays.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow animate-fade-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Examples of Successful Partnerships
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {successStories.map((story, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl bg-card border border-border overflow-hidden group hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{story.company}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{story.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <img
              src={partnershipCollab}
              alt="Partnership Collaboration"
              className="w-full max-w-md rounded-2xl hover-scale"
            />
          </div>
        </div>
      </section>

      {/* Benefits for Real Estate Companies */}
      <section className="py-16 md:py-24 bg-background">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                For Real Estate Companies
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Benefits for Real Estate Companies
              </h2>
              <div className="space-y-6">
                {realEstateBenefits.map((item, i) => (
                  <div key={i} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                      <p className="text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={partnershipValue}
                alt="Property Value Increase"
                className="w-full max-w-sm hover-scale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Homebuyers */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              For Homebuyers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Benefits for Homebuyers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {homebuyerBenefits.map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Partner With SOHUB Protect
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
            Elevate your properties with smart security solutions. Let's build safer communities together.
          </p>
          <a
            href="/#contact"
            className="inline-block bg-primary-foreground text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary-foreground/90 transition-colors hover-scale"
          >
            Contact Us Today
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnership;
