import { Battery, Wifi, Shield, Headphones, CreditCard } from "lucide-react";
import CompatibilityIcons from "./CompatibilityIcons";

const features = [
  {
    icon: Wifi,
    title: "স্মার্ট ইন্টিগ্রেশন",
    desc: "Google Home, Alexa এবং অন্যান্য স্মার্ট হোম ইকোসিস্টেমের সাথে সহজেই যুক্ত হয়।",
  },
  {
    icon: Battery,
    title: "ব্যাটারি ব্যাকআপ",
    desc: "নিরবিচ্ছিন্ন নিরাপত্তা নিশ্চিত করার জন্য বিল্ট-ইন ব্যাটারি ব্যাকআপ।",
  },
  {
    icon: CreditCard,
    title: "কোনো মাসিক ফি নেই",
    desc: "একবার কিনুন, চিরকাল ব্যবহার করুন। কোনো প্রকার মাসিক সাবস্ক্রিপশন ফি নেই।",
  },
  {
    icon: Shield,
    title: "১ বছরের ওয়ারেন্টি",
    desc: "সকল পণ্যে এক বছরের ওয়ারেন্টি সুবিধা।",
  },
  {
    icon: Headphones,
    title: "ফ্রি টেকনিক্যাল সাপোর্ট",
    desc: "ফ্রি পরামর্শ এবং টেকনিক্যাল সাপোর্ট, কোনো অতিরিক্ত খরচ ছাড়াই।",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
            অন্যান্য সুবিধা
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            কেন SOHUB Protect আলাদা?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <f.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Compatibility section */}
        <div className="mt-16 flex justify-center">
          <CompatibilityIcons variant="dark" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
