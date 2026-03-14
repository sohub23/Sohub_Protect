import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import panelImage from "@/assets/panel-product.png";
import hero2Image from "@/assets/afford_trans.jpeg";
import proNewImage from "@/assets/pro_trans.jpeg";
import howDevicesImage from "@/assets/how-devices.png";
import { Check, ChevronRight, Wifi, Signal, Shield, Smartphone, Radio, Battery, X } from "lucide-react";
import specImage from "@/assets/spec.png";
import { motion, AnimatePresence } from "framer-motion";

interface Package {
  id: string;
  name: string;
  nameBn: string;
  tagline: string;
  model: string;
  price: number;
  image: string;
  connectivity: string;
  features: string[];
  specs: { icon: typeof Wifi; title: string; desc: string }[];
  highlight?: boolean;
}

const packages: Package[] = [
  {
    id: "sp01",
    name: "Affordable Edition",
    nameBn: "SOHUB Protect",
    tagline: "সাশ্রয়ী। নির্ভরযোগ্য।",
    model: "SP01-WiFi-Kit",
    price: 7490,
    image: hero2Image,
    connectivity: "WiFi",
    features: [
      "১টি Smart Cube Panel",
      "১টি Motion Sensor",
      "১টি Door Sensor",
      "১টি Remote",
      "Power Adapter",
    ],
    specs: [
      { icon: Wifi, title: "WiFi Connectivity", desc: "2.4GHz WiFi দিয়ে সংযুক্ত হয়" },
      { icon: Radio, title: "Wireless Sensors", desc: "Motion ও Door sensor অন্তর্ভুক্ত" },
      { icon: Smartphone, title: "App Control", desc: "Smart Life অ্যাপ দিয়ে নিয়ন্ত্রণ করুন" },
      { icon: Shield, title: "১ বছরের ওয়ারেন্টি", desc: "সম্পূর্ণ পণ্যে ওয়ারেন্টি সুবিধা" },
      { icon: Battery, title: "No Monthly Fee", desc: "একবার কিনুন, চিরকাল ব্যবহার করুন" },
    ],
  },
  {
    id: "sp05",
    name: "Pro Edition",
    nameBn: "SOHUB Protect",
    tagline: "প্রিমিয়াম। সম্পূর্ণ নিরাপত্তা।",
    model: "SP05-Smart-Panel-Kit",
    price: 15990,
    image: proNewImage,
    connectivity: "WiFi + 4G",
    features: [
      '১টি 5" Smart Touch Panel',
      "১টি Motion Sensor",
      "১টি Door Sensor",
      "২টি Remote",
      "Power Adapter",
    ],
    specs: [
      { icon: Wifi, title: "WiFi + 4G Connectivity", desc: "ডুয়াল কানেক্টিভিটি — কখনো অফলাইন নয়" },
      { icon: Radio, title: "Wireless Sensors", desc: "Motion ও Door sensor অন্তর্ভুক্ত" },
      { icon: Smartphone, title: "Touch Panel Control", desc: '5" টাচ প্যানেল দিয়ে নিয়ন্ত্রণ করুন' },
      { icon: Signal, title: "4G SIM Support", desc: "ইন্টারনেট না থাকলেও কাজ করে" },
      { icon: Shield, title: "১ বছরের ওয়ারেন্টি", desc: "সম্পূর্ণ পণ্যে ওয়ারেন্টি সুবিধা" },
      { icon: Battery, title: "No Monthly Fee", desc: "একবার কিনুন, চিরকাল ব্যবহার করুন" },
    ],
    highlight: true,
  },
];

const PackagesSection = () => {
  const [selected, setSelected] = useState("sp05");
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showFullSpecs) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showFullSpecs]);

  const handleOrder = (editionId: string) => {
    // Update URL with edition param, then scroll to order section
    navigate(`/?edition=${editionId}#order`, { replace: true });
    setTimeout(() => {
      const orderEl = document.getElementById('order');
      if (orderEl) {
        orderEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section id="packages" className="py-24 lg:py-32 bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
            Choose Your Edition
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            আপনার জন্য সঠিক প্যাকেজটি বেছে নিন
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-base">
            দুটি এডিশন। সীমাহীন নিরাপত্তা। প্রতিটি প্যাকেজ আপনার প্রয়োজন মেটায়।
          </p>
        </div>

        {/* Product Cards - Side by Side */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`relative bg-card rounded-2xl md:rounded-3xl p-4 md:p-8 cursor-pointer transition-all duration-300 w-full lg:w-[430px] h-auto mx-auto ${selected === pkg.id
                ? "border-2 border-primary shadow-sm"
                : "border border-border hover:border-primary/30 shadow-none"
                }`}
            >
              {/* Product Image */}
              <div className="flex justify-center items-center mb-6 -mt-4 sm:-mt-8 -mx-4 sm:-mx-8 h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden rounded-t-2xl md:rounded-t-3xl">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover scale-[0.90] mix-blend-multiply origin-center"
                />
              </div>

              {/* Product Name */}
              <div className="text-center mt-2">
                <h3 className="text-lg font-bold text-foreground">{pkg.nameBn}</h3>
                <p className="text-sm text-primary font-medium">{pkg.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Row */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto mb-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="text-center py-4">
              <span className="text-lg md:text-xl font-bold text-foreground">
                {pkg.price.toLocaleString()} BDT
              </span>
              <span className="text-muted-foreground text-xs md:text-sm ml-1">/ one-time</span>
              <div className="mt-3">
                <button
                  onClick={() => handleOrder(pkg.id)}
                  className={`inline-flex items-center justify-center gap-1.5 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium text-xs md:text-sm transition-colors ${selected === pkg.id
                    ? "bg-primary text-primary-foreground hover:bg-brand-dark"
                    : "bg-muted text-foreground hover:bg-primary/10"
                    }`}
                >
                  অর্ডার করুন
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications - Side by Side */}
        <div className="border-t border-border pt-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id}>
                <h4 className="text-sm md:text-base font-bold text-foreground mb-6">
                  {pkg.name} Specifications
                </h4>
                <div className="space-y-5 md:space-y-6">
                  {pkg.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2.5 md:gap-3">
                      <spec.icon className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs md:text-sm font-semibold text-foreground">{spec.title}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{spec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Included Items */}
                <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border">
                  <p className="text-xs md:text-sm font-semibold text-foreground mb-3">
                    প্যাকেজে যা যা আছে
                  </p>
                  <ul className="space-y-2">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] md:text-sm text-muted-foreground">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-[11px] md:text-sm text-primary font-medium">
                      <Check className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      No Monthly Fee
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Full Specifications Image Overlay */}
        <AnimatePresence>
          {showFullSpecs && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFullSpecs(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative z-10 w-full max-h-screen overflow-y-auto px-4 py-16 md:px-8 md:py-24 flex justify-center items-start"
              >
                {/* Floating Close Button */}
                <button
                  onClick={() => setShowFullSpecs(false)}
                  className="fixed top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all duration-200 border border-white/20 backdrop-blur-md z-[110]"
                >
                  <X className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <img
                  src={specImage}
                  alt="SOHUB Protect Specifications"
                  className="w-full h-auto max-w-[80vw] lg:max-w-2xl shadow-2xl rounded-sm object-contain border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PackagesSection;
