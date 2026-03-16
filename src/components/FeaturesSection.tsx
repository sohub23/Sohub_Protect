import { Battery, Wifi, Shield, Headphones, CreditCard, LayoutGrid, Smartphone } from "lucide-react";
import CompatibilityIcons from "./CompatibilityIcons";

const features = [
  {
    icon: CreditCard,
    title: "কোনো মাসিক ফি নেই",
    desc: "একবার সেটআপ করলেই ব্যবহার করতে পারবেন। কোনো মাসিক সাবস্ক্রিপশন ফি নেই।",
  },
  {
    icon: LayoutGrid,
    title: "সম্পূর্ণ নিরাপত্তা সমাধান",
    desc: "একাধিক সেন্সর, সাইরেন, ক্যামেরা এবং সিগন্যাল এক্সটেন্ডার যুক্ত করে আপনার প্রয়োজন অনুযায়ী পুরো সিস্টেমটি সহজেই বাড়ানো যায়।",
  },
  {
    icon: Wifi,
    title: "স্মার্ট ইন্টিগ্রেশন",
    desc: "Google Home, Amazon Alexa এবং অন্যান্য স্মার্ট হোম প্ল্যাটফর্মের সাথে সহজেই সংযুক্ত করা যায়।",
  },
  {
    icon: Battery,
    title: "ব্যাটারি ও 4G সিম ব্যাকআপ",
    desc: "বিদ্যুৎ বা ইন্টারনেট সংযোগ বন্ধ হয়ে গেলেও ব্যাটারি এবং 4G সিম ব্যাকআপের মাধ্যমে সিস্টেম সচল থাকে।",
  },
  {
    icon: Shield,
    title: "১ বছরের ওয়ারেন্টি",
    desc: "সকল পণ্যের সাথে রয়েছে এক বছরের ওয়ারেন্টি সুবিধা।",
  },
  {
    icon: Smartphone,
    title: "নিরাপত্তা নিশ্চিত করুন",
    desc: "ফ্রি পরামর্শ নিন এবং আপনার প্রয়োজন অনুযায়ী সঠিক সিকিউরিটি সলিউশন বেছে নিন।",
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
            SOHUB Protect কেন বেছে নেবেন
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-4 md:p-7 rounded-xl md:rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <f.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mb-2 md:mb-4" />
              <h3 className="text-sm md:text-lg font-semibold text-foreground mb-1 md:mb-2">{f.title}</h3>
              <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
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
